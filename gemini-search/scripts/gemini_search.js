/**
 * gemini-search skill — scripts/gemini_search.js (v4)
 *
 * Rewritten for maximum Android WebView compatibility:
 * - No AbortSignal.timeout() (not supported in older WebView)
 * - No Promise.allSettled() (not in older WebView)
 * - No optional chaining ?. in older engines
 * - Uses only: fetch, Promise, JSON, basic ES6
 *
 * Search sources (tried in sequence, first success wins):
 *   1. Google News RSS via allorigins.win proxy
 *   2. Google News RSS via rss2json.com proxy
 *   3. Hacker News via Algolia API (great CORS, always works)
 *   4. Wikipedia (fallback for facts)
 *
 * Entry point: geminiSearch(query, userQuestion, apiKey)
 */

var GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
var MODELS = [
  "gemini-2.5-flash-preview-05-20",
  "gemini-2.5-flash-lite-preview-06-17",
  "gemini-1.5-flash"
];

// ─────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────

async function geminiSearch(query, userQuestion, apiKey) {
  if (!apiKey || apiKey.trim() === "") {
    return JSON.stringify({
      success: false,
      error: "No Gemini API key provided.",
      help: "Get a free key at https://aistudio.google.com/apikey"
    });
  }

  var question = userQuestion || query;
  var results = [];
  var usedSource = "none";

  // Try each source in order, stop at first success
  var sources = [
    { name: "Google News (proxy 1)", fn: function() { return searchGoogleNewsAllOrigins(query); } },
    { name: "Google News (proxy 2)", fn: function() { return searchGoogleNewsRss2Json(query); } },
    { name: "Hacker News",           fn: function() { return searchHackerNews(query); } },
    { name: "Wikipedia",             fn: function() { return searchWikipedia(query); } }
  ];

  for (var i = 0; i < sources.length; i++) {
    try {
      var found = await fetchWithTimeout(sources[i].fn(), 8000);
      if (found && found.length > 0) {
        results = found;
        usedSource = sources[i].name;
        break;
      }
    } catch (e) {
      // Source failed, try next
      console.warn(sources[i].name + " failed: " + e.message);
    }
  }

  // Build prompt and call Gemini
  var prompt = buildPrompt(question, results, usedSource);
  var geminiResult = await callGeminiWithFallback(prompt, apiKey);

  if (!geminiResult.success) {
    return JSON.stringify({
      success: false,
      errorCode: geminiResult.errorCode,
      error: geminiResult.error,
      help: geminiResult.help || ""
    });
  }

  var sources_out = [];
  for (var j = 0; j < results.length && j < 6; j++) {
    var r = results[j];
    if (r.url && r.url.indexOf("http") === 0) {
      sources_out.push({ title: r.title, url: r.url, date: r.date || "" });
    }
  }

  return JSON.stringify({
    success: true,
    answer: geminiResult.text,
    sources: sources_out,
    searchSource: usedSource,
    model: geminiResult.model,
    resultCount: results.length
  });
}

// ─────────────────────────────────────────────
// TIMEOUT WRAPPER (no AbortSignal — uses race)
// ─────────────────────────────────────────────

function fetchWithTimeout(promise, ms) {
  var timeout = new Promise(function(_, reject) {
    setTimeout(function() { reject(new Error("Timed out after " + ms + "ms")); }, ms);
  });
  return Promise.race([promise, timeout]);
}

// ─────────────────────────────────────────────
// SOURCE 1: Google News RSS via allorigins.win
// ─────────────────────────────────────────────

async function searchGoogleNewsAllOrigins(query) {
  var rssUrl = "https://news.google.com/rss/search?q=" + encodeURIComponent(query) + "&hl=en-US&gl=US&ceid=US:en";
  var proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(rssUrl);

  var resp = await fetch(proxyUrl);
  if (!resp.ok) throw new Error("allorigins HTTP " + resp.status);

  var data = await resp.json();
  if (!data.contents) throw new Error("allorigins: empty response");

  var items = parseRssXml(data.contents, 8);
  if (items.length === 0) throw new Error("No items in RSS");
  return items;
}

// ─────────────────────────────────────────────
// SOURCE 2: Google News RSS via rss2json.com
// ─────────────────────────────────────────────

async function searchGoogleNewsRss2Json(query) {
  var rssUrl = "https://news.google.com/rss/search?q=" + encodeURIComponent(query) + "&hl=en-US&gl=US&ceid=US:en";
  var apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(rssUrl) + "&count=8";

  var resp = await fetch(apiUrl);
  if (!resp.ok) throw new Error("rss2json HTTP " + resp.status);

  var data = await resp.json();
  if (data.status !== "ok" || !data.items || data.items.length === 0) {
    throw new Error("rss2json: no items");
  }

  var items = [];
  for (var i = 0; i < data.items.length; i++) {
    var item = data.items[i];
    items.push({
      title:   item.title || "",
      url:     item.link || "",
      snippet: stripHtml(item.description || item.content || "").substring(0, 400),
      date:    item.pubDate || "",
      source:  item.author || extractDomain(item.link)
    });
  }
  return items;
}

// ─────────────────────────────────────────────
// SOURCE 3: Hacker News via Algolia
// Best CORS support — almost never fails
// ─────────────────────────────────────────────

async function searchHackerNews(query) {
  var url = "https://hn.algolia.com/api/v1/search?query=" + encodeURIComponent(query) + "&tags=story&hitsPerPage=6";

  var resp = await fetch(url);
  if (!resp.ok) throw new Error("HN HTTP " + resp.status);

  var data = await resp.json();
  if (!data.hits || data.hits.length === 0) throw new Error("No HN results");

  var items = [];
  for (var i = 0; i < data.hits.length; i++) {
    var h = data.hits[i];
    if (!h.title) continue;
    items.push({
      title:   h.title,
      url:     h.url || ("https://news.ycombinator.com/item?id=" + h.objectID),
      snippet: h.story_text ? stripHtml(h.story_text).substring(0, 300)
                             : (h.points || 0) + " points on Hacker News",
      date:    h.created_at || "",
      source:  "Hacker News"
    });
  }

  if (items.length === 0) throw new Error("No valid HN items");
  return items;
}

// ─────────────────────────────────────────────
// SOURCE 4: Wikipedia
// ─────────────────────────────────────────────

async function searchWikipedia(query) {
  var searchUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search="
    + encodeURIComponent(query) + "&limit=1&format=json&origin=*";

  var searchResp = await fetch(searchUrl);
  if (!searchResp.ok) throw new Error("Wikipedia HTTP " + searchResp.status);

  var searchData = await searchResp.json();
  var titles = searchData[1];
  var urls   = searchData[3];
  if (!titles || titles.length === 0) throw new Error("No Wikipedia results");

  var summaryUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(titles[0]);
  var summaryResp = await fetch(summaryUrl);

  var snippet = "";
  if (summaryResp.ok) {
    var s = await summaryResp.json();
    snippet = (s.extract || s.description || "").substring(0, 600);
  }

  return [{
    title:   titles[0],
    url:     urls[0],
    snippet: snippet,
    date:    "",
    source:  "Wikipedia"
  }];
}

// ─────────────────────────────────────────────
// PROMPT BUILDER
// ─────────────────────────────────────────────

function buildPrompt(question, results, source) {
  var today = new Date().toDateString();

  var contextBlock;
  var instruction;

  if (!results || results.length === 0) {
    contextBlock = "[No live web data available]";
    instruction = "Answer from your training knowledge. Start your answer with: "
      + "\"Note: I could not retrieve live web data, so this may be outdated.\"";
  } else {
    var lines = [];
    var limit = results.length < 8 ? results.length : 8;
    for (var i = 0; i < limit; i++) {
      var r = results[i];
      var date = r.date ? " (" + r.date.substring(0, 16) + ")" : "";
      var src  = r.source ? " — " + r.source : "";
      lines.push("[" + (i+1) + "]" + date + src + "\nTitle: " + r.title + "\nURL: " + (r.url || "N/A") + "\n" + (r.snippet || ""));
    }
    contextBlock = lines.join("\n\n---\n\n");
    instruction = "Answer using the live search results above. They are more current than your training data. "
      + "Be direct and factual. Cite which source numbers you used. Keep it concise.";
  }

  return "Today is " + today + ". Search source used: " + source + ".\n\n"
    + instruction + "\n\n"
    + "## Live Search Results\n" + contextBlock + "\n\n"
    + "## Question\n" + question + "\n\n"
    + "## Answer";
}

// ─────────────────────────────────────────────
// GEMINI API WITH MODEL FALLBACK
// ─────────────────────────────────────────────

async function callGeminiWithFallback(prompt, apiKey) {
  for (var i = 0; i < MODELS.length; i++) {
    var result = await callGemini(MODELS[i], prompt, apiKey);
    if (result.success) return result;
    if (result.errorCode === 401 || result.errorCode === 403 || result.errorCode === 429) {
      return result; // No point trying other models
    }
    // 404 = model not available, try next
  }
  return { success: false, errorCode: 0, error: "All Gemini models unavailable." };
}

async function callGemini(model, prompt, apiKey) {
  var url = GEMINI_BASE + "/" + model + ":generateContent?key=" + apiKey;

  var body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 1024, temperature: 0.4, topP: 0.95 },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
    ]
  };

  var resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  var data = await resp.json();

  if (!resp.ok) {
    var code   = (data.error && data.error.code)   || resp.status;
    var status = (data.error && data.error.status) || "";
    var error  = (data.error && data.error.message) || ("HTTP " + resp.status);
    var help   = "";
    if (code === 401 || code === 403 || status === "PERMISSION_DENIED") {
      error = "Invalid Gemini API key.";
      help  = "Get a free key at https://aistudio.google.com/apikey";
    } else if (code === 429 || status === "RESOURCE_EXHAUSTED") {
      error = "Gemini free tier limit reached (500/day). Try again tomorrow.";
      help  = "https://aistudio.google.com";
    } else if (code === 404) {
      error = "Model " + model + " not available, trying next.";
    }
    return { success: false, errorCode: code, error: error, help: help };
  }

  var candidate = data.candidates && data.candidates[0];
  if (!candidate) return { success: false, errorCode: 0, error: "No response from Gemini." };
  if (candidate.finishReason === "SAFETY") return { success: false, errorCode: 0, error: "Blocked by safety filters." };

  var parts = candidate.content && candidate.content.parts || [];
  var text = "";
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].text) text += parts[i].text;
  }

  return { success: true, text: text, model: model };
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function parseRssXml(xml, limit) {
  var items = [];
  var itemRegex = /<item>([\s\S]*?)<\/item>/g;
  var match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    var block   = match[1];
    var title   = extractXmlTag(block, "title");
    var link    = extractXmlTag(block, "link");
    var desc    = extractXmlTag(block, "description");
    var pubDate = extractXmlTag(block, "pubDate");
    var source  = extractXmlTag(block, "source");
    if (title || link) {
      items.push({
        title:   stripHtml(title || ""),
        url:     link || "",
        snippet: stripHtml(desc || "").substring(0, 400),
        date:    pubDate || "",
        source:  source || extractDomain(link)
      });
    }
  }
  return items;
}

function extractXmlTag(xml, tag) {
  var cdataRe = new RegExp("<" + tag + "[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/" + tag + ">");
  var plainRe = new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)<\\/" + tag + ">");
  var m = xml.match(cdataRe) || xml.match(plainRe);
  return m ? m[1].trim() : "";
}

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s\s+/g, " ").trim();
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch (e) {
    return "";
  }
}
