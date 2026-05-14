# Quick Start Guide

Get started with Edge Gallery AI Skills in 5 minutes.

## Step 1: Get Your API Key (2 min)

1. Go to **https://aistudio.google.com/apikey**
2. Click **"Get API Key"** button
3. Select **"Create API key in new project"**
4. Copy the generated key
5. Keep it safe! You'll need it soon.

## Step 2: Download Skills (1 min)

Clone or download this repository to your computer:
```bash
git clone https://github.com/ankitnegialt/gemini-api-skill.git
```

Or download as ZIP and extract.

## Step 3: Import Skills to Edge Gallery (2 min)

On your Android phone:

1. **Open Edge Gallery** app
2. Go to **Agent Skills** section
3. Tap the **"Skills"** chip (shows number of active skills)
4. Tap the blue **"+"** button
5. Choose **"Import local skill"**
6. Navigate to downloaded folder
7. Select **`gemini-api`** folder first
8. Tap to import

Repeat for other skills:
- `gemini-search` (for news/current info)
- `document-analyzer` (for PDFs/images)
- `google-web-search` (for quick facts)

## Step 4: Enter API Key (1 min)

When you use a skill for the first time:
- A dialog appears asking for **Gemini API key**
- Paste the key from Step 1
- Edge Gallery stores it securely

**That's it! You're ready to use the skills.**

---

## Test It Out

Try these prompts with Gemma 4 E2B-it:

### Test Gemini API
```
"Ask Gemini: What are the best Python practices?"
```

### Test Gemini Search
```
"What's the latest news in AI today?"
```

### Test Document Analyzer
```
Select a PDF, then: "Summarize this document"
```

### Test Web Search
```
"Search for the current Bitcoin price"
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Skill execution failed" | Delete skill, re-import, restart app |
| "No API key" | Make sure you entered key when prompted |
| "Quota exceeded" | Free tier is 500/day. Wait 24 hours or upgrade |
| "Can't import" | Try one skill at a time, restart app |
| "Network error" | Check internet connection, try again |

---

## Next Steps

- Read individual skill docs: `[skill-name]/USAGE_GUIDE.md`
- Check API quota: https://aistudio.google.com/app/apikeys
- Explore more prompts and use cases
- Share skills with friends!

---

## Support

- **Gemini API issues:** https://ai.google.dev
- **Edge Gallery help:** https://developer.google.com/edge-ai/edge-gallery
- **GitHub issues:** Report bugs on this repository

---

**Happy prompting! 🚀**
