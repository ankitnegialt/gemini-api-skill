---
name: gemini-api
description: Send prompts to Google Gemini 2.5 Flash cloud model and get responses back inline.
require-secret: true
require-secret-description: Enter your Google Gemini API key from https://aistudio.google.com/apikey
---

# Gemini API

Route questions to Gemini 2.5 Flash (cloud) for answers beyond the on-device model.

## How it works

1. User prompt → sent to Gemini 2.5 Flash via API
2. Response returned and displayed

## Requirements

- Google Gemini API key (free tier available)
- Internet connection

## Models used (in order)

1. gemini-2.5-flash (primary)
2. gemini-2.5-flash-lite (backup)
3. gemini-1.5-flash (fallback)
