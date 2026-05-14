---
name: google-web-search
description: Search the web using Google Search (via SerpApi-compatible free endpoint) to find current information, news, facts, and answers. Use this skill whenever the user asks about recent events, wants to look something up online, needs current data, or asks any question that benefits from a live web search.
---

# Google Web Search

Search the web for up-to-date information using Google Search results.

## When to use this skill

Use whenever the user:
- Asks about recent news or current events
- Wants to look something up ("search for...", "find information about...")
- Needs facts that may have changed recently
- Asks a question you're not confident answering from training alone

## How it works

This skill runs a JavaScript function inside the app's webview. It queries the **SerpApi-free mirror** (no API key needed) or falls back to the **DuckDuckGo Instant Answer API**, then fetches the top result pages for real content.

## Instructions

1. Extract the user's search intent as a concise query (3–7 words).
2. Call the `search` function defined in `scripts/search.js` with the query.
3. Read the returned results: each has a `title`, `url`, and `snippet`.
4. If the snippets answer the question, summarize them for the user.
5. If more detail is needed, call `fetch_page` with the most relevant URL to read the full article.
6. Always cite the source title and URL when presenting information.

## Tool schema

The app will call your JS entry function with these parameters:

```json
{
  "query": "string — the search query",
  "num_results": "number — how many results to return (default 5)"
}
```

## Script

Run `scripts/search.js` — it exports an async function `search(query, numResults)`.

## Output format

Return a markdown summary like:

```
**[Result Title](url)**
Brief summary of what was found.

Source: url
```

If multiple results are relevant, list up to 3 with brief summaries.

## Error handling

- If the search API fails, tell the user and suggest they try rephrasing.
- If fetch is blocked (CORS), use the snippet only and note the limitation.
- Never fabricate search results — only report what the API returns.
