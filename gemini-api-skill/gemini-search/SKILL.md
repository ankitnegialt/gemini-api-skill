---
name: gemini-search
description: Search the web and ask Gemini 2.5 Flash to answer based on fresh data.
require-secret: true
require-secret-description: Enter your Google Gemini API key from https://aistudio.google.com/apikey
---

# Gemini Search

Searches the web for current information, then sends results to Gemini 2.5 Flash for a grounded answer.

## How it works

1. Search the web (Google News, Hacker News, Wikipedia)
2. Send results to Gemini 2.5 Flash
3. Gemini reasons over fresh data
4. Return answer with sources

## When to use

- "What's the latest news on...?"
- "What happened today/this week?"
- "Current price/score of...?"
- Any question requiring fresh, up-to-date information

## Requirements

- Google Gemini API key (free tier: 500 requests/day)
- Internet connection

## Search sources

- Google News RSS
- Hacker News (via Algolia API)
- Wikipedia (for context)
