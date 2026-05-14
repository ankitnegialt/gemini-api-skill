# Edge Gallery Skills — AI-Powered Agent Skills for Google AI Edge Gallery

A collection of powerful, free AI agent skills for **Google AI Edge Gallery** running Gemma 4 E2B-it on Android. These skills extend your local AI model with cloud capabilities (Gemini 2.5 Flash), web search, document analysis, and more.

## 🎯 Skills Included

### 1. **Gemini API** (`gemini-api/`)
Direct access to Google Gemini 2.5 Flash for complex reasoning, coding, and advanced tasks.

- **Use when:** You need more power than the on-device model
- **Features:** 
  - Cloud-based Gemini 2.5 Flash reasoning
  - 500 requests/day free tier
  - Fallback model chain
  - Multi-turn conversation support
- **Cost:** Free (with Gemini API key)

### 2. **Gemini Search** (`gemini-search/`)
Web search + Gemini reasoning pipeline for current information and news.

- **Use when:** You need latest news, current prices, recent events
- **Features:**
  - Google News RSS integration
  - Hacker News (via Algolia API)
  - Wikipedia fallback
  - Live search + Gemini grounding
  - Automatic source citing
- **Cost:** Free (web searches are unlimited)

### 3. **Document Analyzer** (`document-analyzer/`)
Read, summarize, answer questions, and generate study materials from PDFs and images.

- **Use when:** You need to analyze local documents
- **Features:**
  - PDF text extraction
  - Image analysis (JPG, PNG, GIF, WebP)
  - Summarization (short/medium/long)
  - Question answering
  - Automatic quiz generation
  - Scanned PDF support
- **Cost:** Free (uses Gemini API quota)

### 4. **Google Web Search** (`google-web-search/`)
Pure web search without AI analysis — returns raw search results.

- **Use when:** You just need facts and links
- **Features:**
  - DuckDuckGo Instant Answer API
  - Wikipedia integration
  - No API key required
  - Multiple fallback sources
  - Fast, lightweight
- **Cost:** Completely free

## 📋 Quick Start

### Prerequisites
- Google AI Edge Gallery app on Android
- Gemini API key (free): https://aistudio.google.com/apikey
- Internet connection

### Installation

1. **Download the skills:**
   - Clone or download this repository
   - Each skill is in its own folder

2. **Import into Edge Gallery:**
   - Open Edge Gallery → Agent Skills → **Skills** chip
   - Tap the **+** button
   - Select **Import local skill**
   - Navigate to skill folder (e.g., `gemini-api/`)
   - Tap to import

3. **Configure API Key:**
   - When you first use a skill needing an API key
   - A dialog will appear: Enter your Gemini API key
   - Key is stored securely and never logged

4. **Start using:**
   - Talk to Gemma 4 E2B-it and mention the skill
   - E.g., "Ask Gemini about quantum computing"
   - Or: "Search for latest AI news"

## 🔧 Skill Details

| Skill | API Key | Free Tier | Best For |
|-------|---------|-----------|----------|
| **gemini-api** | ✅ Gemini | 500 req/day | Complex tasks, reasoning |
| **gemini-search** | ✅ Gemini | 500 req/day | Current events, news |
| **document-analyzer** | ✅ Gemini | 500 req/day | PDFs, images, study materials |
| **google-web-search** | ❌ None | Unlimited | Facts, links, quick searches |

## 📊 API Quotas

### Gemini (Free Tier)
- **Rate:** 10 requests/min, 500 requests/day
- **Models:** gemini-2.5-flash (primary) with fallbacks
- **Cost:** $0.00 free tier (pay-as-you-go after)

### Web Search
- **DuckDuckGo:** Unlimited, no key
- **Wikipedia:** Unlimited, no key
- **Hacker News (Algolia):** Unlimited, no key
- **Google News RSS:** Unlimited (via proxy)

## 💡 Usage Examples

### Example 1: Ask Gemini
```
User: "Ask Gemini: How do I optimize Python code?"
→ Gemini 2.5 Flash explains optimization techniques
```

### Example 2: Search for News
```
User: "What's the latest news in AI?"
→ Searches Google News + Hacker News
→ Gemini summarizes findings with sources
```

### Example 3: Analyze a Document
```
User: "Summarize this PDF" (after selecting file)
→ Extracts text from PDF
→ Returns concise summary
→ Can answer follow-up questions
```

### Example 4: Generate Study Materials
```
User: "Generate quiz questions from this textbook chapter"
→ Creates 5 study questions
→ Mix of MCQ, short answer, essay
→ Includes answer hints
```

## 🛠️ Technical Details

### Architecture
- **Runtime:** Edge Gallery hidden WebView (Chromium-based)
- **Language:** JavaScript (ES6+, WebView compatible)
- **API:** Gemini REST API (`/v1/messages` endpoint)
- **File Formats:** SKILL.md (YAML) + JavaScript

### File Structure
```
skill-name/
├── SKILL.md              # Metadata & documentation
├── USAGE_GUIDE.md        # Optional: usage examples
└── scripts/
    └── main.js           # Entry point function
```

### Skill Requirements
- **Entry function:** Must be async and named (e.g., `geminiSearch`)
- **Parameters:** Vary by skill (see SKILL.md)
- **Return:** JSON string with `success`, `answer`/`result`, optional metadata
- **Timeouts:** 15-30 seconds recommended

## ⚙️ Configuration

### Get Gemini API Key
1. Go to https://aistudio.google.com/apikey
2. Click **"Get API Key"** → **"Create API key in new project"**
3. Copy the key
4. Paste into Edge Gallery when prompted

### Free Tier Limits
- **500 requests/day** across all Gemini models
- **10 requests/minute** rate limit
- **2048 tokens** max output per request
- Resets daily at UTC midnight

### Manage Quota
- Track usage: https://aistudio.google.com/app/apikeys
- Upgrade anytime: https://aistudio.google.com/billing
- No credit card required for free tier

## 🐛 Troubleshooting

### "Skill execution failed"
- Check SKILL.md syntax (valid YAML frontmatter)
- Ensure entry function exists and is async
- Verify JSON return format
- Check browser console for JS errors

### "No API key provided"
- Ensure you entered key when prompted
- Re-import skill to reset
- Check key at https://aistudio.google.com/apikeys

### "Quota exceeded"
- Free tier is 500 requests/day
- Wait 24 hours for reset
- Or upgrade plan at aistudio.google.com

### File import not working
- Try importing one skill at a time
- Ensure SKILL.md is in root of folder
- Check folder permissions
- Restart Edge Gallery app

## 📖 Documentation

Each skill includes:
- **SKILL.md** — Metadata, triggers, instructions
- **USAGE_GUIDE.md** (some skills) — Examples and tips
- **Inline comments** in JavaScript source

## 🤝 Contributing

Want to add or improve a skill?

1. Create a new folder following the structure
2. Write SKILL.md with proper metadata
3. Implement the skill in `scripts/main.js`
4. Test in Edge Gallery
5. Submit a pull request

### Skill Development Checklist
- [ ] SKILL.md with valid YAML
- [ ] Entry function is async
- [ ] Returns JSON with `success` field
- [ ] Handles errors gracefully
- [ ] Timeouts under 30 seconds
- [ ] No localStorage/sessionStorage (use state only)
- [ ] CORS-friendly API calls
- [ ] Tested on Android WebView

## 📄 License

MIT License — Use freely, modify, and redistribute.

## 🙋 Support

### Common Issues
- **CORS errors?** Use CORS proxies or backend APIs (see skills for examples)
- **Timeouts?** Reduce token limits or optimize prompts
- **Large files?** Keep PDFs under 20MB; use compression

### Get Help
- Check individual skill USAGE_GUIDE.md
- Review error messages in Edge Gallery
- Verify API keys and quotas
- Check internet connection

## 🎓 Learning Resources

- **Edge Gallery docs:** https://developer.google.com/edge-ai/edge-gallery
- **Gemini API guide:** https://ai.google.dev/docs
- **JavaScript promises:** MDN Promises documentation
- **Fetch API:** MDN Fetch documentation

## 🚀 Future Enhancements

Planned skills:
- [ ] Claude API integration
- [ ] OpenRouter models
- [ ] Voice input/output
- [ ] File upload to storage
- [ ] Database queries
- [ ] Email integration
- [ ] Calendar integration

---

**Made for Google AI Edge Gallery with Gemma 4 E2B-it**

Last updated: May 2026 | Gemini 2.5 Flash compatible
