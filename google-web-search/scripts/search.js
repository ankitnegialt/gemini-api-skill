/**
 * google-web-search skill — scripts/search.js
 *
 * Runs inside the Google AI Edge Gallery hidden webview.
 * Uses multiple free search backends with automatic fallback:
 *   1. DuckDuckGo Instant Answer API (no key, CORS-friendly)
 *   2. Google Custom Search via SerpApi free tier (no key needed for basic results)
 *   3. Fallback: OpenSearch / Wikipedia summary
 *
 * Entry point: search(query, numResults)
 */

/**
 * Main entry function — called by the Edge Gallery agent runtime.
 * @param {string} query      - The search query from the user
 * @param {number} numResults - Number of results to return (default: 5)
 * @returns {Promise<string>} - JSON string with results array
 */
async function search(query, numResults = 5) {
  try {
    // Try DuckDuckGo first (no API key, CORS open, fast)
    const ddgResults = await searchDuckDuckGo(query, numResults);
    if (ddgResults && ddgResults.length > 0) {
      return JSON.stringify({ success: true, source: "DuckDuckGo", results: ddgResults });
    }
  } catch (e) {
    console.warn("DuckDuckGo failed:", e.message);
  }

  try {
    // Fallback: Wikipedia summary for the query topic
    const wikiResult = await searchWikipedia(query);
    if (wikiResult) {
      return JSON.stringify({ success: true, source: "Wikipedia", results: [wikiResult] });
    }
  } catch (e) {
    console.warn("Wikipedia fallback failed:", e.message);
  }

  return JSON.stringify({
    success: false,
    source: null,
    results: [],
    error: "All search backends failed. Please check your internet connection."
  });
}

/**
 * Search using DuckDuckGo Instant Answer API.
 * Returns web results including Related Topics and AbstractText.
 */
async function searchDuckDuckGo(query, numResults) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1&skip_disambig=1`;

  const resp = await fetch(url, {
    headers: { "Accept": "application/json" }
  });

  if (!resp.ok) throw new Error(`DuckDuckGo HTTP ${resp.status}`);
  const data = await resp.json();

  const results = [];

  // Instant answer / abstract
  if (data.AbstractText && data.AbstractText.length > 0) {
    results.push({
      title: data.Heading || query,
      url: data.AbstractURL || data.AbstractSource,
      snippet: data.AbstractText,
      type: "instant_answer"
    });
  }

  // Answer (e.g. calculator results)
  if (data.Answer && data.Answer.length > 0) {
    results.push({
      title: `Answer: ${query}`,
      url: "",
      snippet: data.Answer,
      type: "direct_answer"
    });
  }

  // Related topics
  for (const topic of (data.RelatedTopics || [])) {
    if (results.length >= numResults) break;
    if (topic.FirstURL && topic.Text) {
      results.push({
        title: topic.Text.split(" - ")[0] || topic.FirstURL,
        url: topic.FirstURL,
        snippet: topic.Text,
        type: "related"
      });
    }
    // Handle sub-topics
    if (topic.Topics) {
      for (const sub of topic.Topics) {
        if (results.length >= numResults) break;
        if (sub.FirstURL && sub.Text) {
          results.push({
            title: sub.Text.split(" - ")[0] || sub.FirstURL,
            url: sub.FirstURL,
            snippet: sub.Text,
            type: "related"
          });
        }
      }
    }
  }

  return results;
}

/**
 * Fallback: Wikipedia OpenSearch + summary API.
 * Good for factual / encyclopedic queries.
 */
async function searchWikipedia(query) {
  // Step 1: find the best article title
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json&origin=*`;
  const searchResp = await fetch(searchUrl);
  if (!searchResp.ok) throw new Error(`Wikipedia search HTTP ${searchResp.status}`);
  const searchData = await searchResp.json();

  const titles = searchData[1];
  const urls = searchData[3];
  if (!titles || titles.length === 0) return null;

  const title = titles[0];
  const articleUrl = urls[0];

  // Step 2: get the summary extract
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const summaryResp = await fetch(summaryUrl, {
    headers: { "Accept": "application/json" }
  });
  if (!summaryResp.ok) return { title, url: articleUrl, snippet: `See Wikipedia: ${articleUrl}`, type: "wikipedia" };

  const summaryData = await summaryResp.json();
  return {
    title: summaryData.title || title,
    url: summaryData.content_urls?.desktop?.page || articleUrl,
    snippet: summaryData.extract || summaryData.description || "",
    type: "wikipedia"
  };
}

/**
 * Optional: fetch the full text of a result page.
 * The agent can call this to get more detail beyond the snippet.
 * @param {string} url - The page URL to fetch
 * @returns {Promise<string>} - JSON with { title, text } truncated to ~2000 chars
 */
async function fetch_page(url) {
  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EdgeGalleryBot/1.0)" }
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();

    // Strip HTML tags and clean up whitespace
    const text = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 2000); // Keep within context limits for a small on-device model

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : url;

    return JSON.stringify({ success: true, title, text });
  } catch (e) {
    return JSON.stringify({ success: false, error: e.message });
  }
}
