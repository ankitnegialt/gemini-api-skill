# Skills Overview & Comparison

Quick reference guide for all included skills.

## Skills at a Glance

### 1️⃣ Gemini API
**Direct cloud AI reasoning**

```
📁 Folder: gemini-api/
🎯 Purpose: Access Gemini 2.5 Flash for complex tasks
💬 Triggers: "Ask Gemini...", "Use Gemini...", "What would Gemini say..."
🔑 API Key: ✅ Required (Gemini)
💰 Cost: Free (500 requests/day)
⚡ Speed: 2-5 seconds per request
📊 Best For: Coding, reasoning, writing, analysis
```

**Example prompts:**
- "Ask Gemini to explain quantum computing"
- "Use Gemini to write Python code for X"
- "What does Gemini think about this topic?"

---

### 2️⃣ Gemini Search
**Web search + AI reasoning**

```
📁 Folder: gemini-search/
🎯 Purpose: Get current information with AI analysis
💬 Triggers: "Latest news about...", "What happened...", "Search for..."
🔑 API Key: ✅ Required (Gemini only, searches are free)
💰 Cost: Free (searches unlimited, 500 Gemini requests/day)
⚡ Speed: 3-8 seconds per request
📊 Best For: News, current events, recent prices, trending topics
```

**Search sources:**
- Google News RSS (live headlines)
- Hacker News (tech news via Algolia)
- Wikipedia (background context)

**Example prompts:**
- "What's the latest news in AI?"
- "Current Bitcoin price"
- "What happened in IPL this week?"
- "Search for recent updates on space exploration"

---

### 3️⃣ Document Analyzer
**PDF & image analysis**

```
📁 Folder: document-analyzer/
🎯 Purpose: Analyze local PDFs and images
💬 Triggers: "Summarize this", "Read this PDF", "Generate questions"
🔑 API Key: ✅ Required (Gemini)
💰 Cost: Free (uses Gemini quota)
⚡ Speed: 2-5 seconds per document
📊 Best For: Study materials, document understanding, quiz generation
```

**Actions:**
- **Read** → Extract full text
- **Summarize** → Concise overview (short/medium/long)
- **Answer** → Q&A about document
- **Generate Questions** → Create study quiz

**Supported formats:**
- PDF (text-based)
- JPG, JPEG, PNG, GIF, WebP

**Example prompts:**
- "Summarize this textbook chapter"
- "Read this PDF to me"
- "What does this image show?"
- "Generate study questions from this document"

---

### 4️⃣ Google Web Search
**Raw web search without AI**

```
📁 Folder: google-web-search/
🎯 Purpose: Pure web search, no analysis
💬 Triggers: "Search for...", "Find...", "Look up..."
🔑 API Key: ❌ Not required
💰 Cost: Completely FREE
⚡ Speed: 1-2 seconds per search
📊 Best For: Quick facts, links, definitions
```

**Search sources:**
- DuckDuckGo Instant Answer API
- Wikipedia
- No CORS issues, pure free APIs

**Example prompts:**
- "Search for Python documentation"
- "Find information about the capital of France"
- "Look up the definition of blockchain"

---

## Quick Comparison Table

| Feature | Gemini API | Gemini Search | Document Analyzer | Web Search |
|---------|-----------|---------------|-------------------|-----------|
| **Requires API Key** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Internet Required** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Can Analyze Files** | ❌ No | ❌ No | ✅ Yes (PDF, images) | ❌ No |
| **Can Search Web** | ❌ No | ✅ Yes | ❌ No | ✅ Yes |
| **Complex Reasoning** | ✅ Yes | ✅ Yes (with search) | ✅ Yes | ❌ No |
| **Cost** | Free tier | Free tier | Free tier | 100% FREE |
| **Speed** | 2-5s | 3-8s | 2-5s | 1-2s |
| **Best For** | Thinking | Current info | Files | Quick facts |

---

## Choose the Right Skill

### When to use **Gemini API**
- ✅ You need to think through a complex problem
- ✅ You want to write or generate content
- ✅ You need coding help
- ✅ You want a second opinion
- ❌ Don't use for: Quick facts (use Web Search instead)

### When to use **Gemini Search**
- ✅ You need current/latest information
- ✅ You want news and headlines
- ✅ You're asking about recent events
- ✅ You need context + AI reasoning together
- ❌ Don't use for: Old facts (Gemini API is faster)

### When to use **Document Analyzer**
- ✅ You have a PDF or image to analyze
- ✅ You need to study/learn from a document
- ✅ You want to generate quiz questions
- ✅ You need text extracted from images
- ❌ Don't use for: Just searching the web

### When to use **Google Web Search**
- ✅ You just need quick facts and links
- ✅ You don't have an API key handy
- ✅ You want the fastest response
- ✅ You're on a tight quota
- ❌ Don't use for: Complex analysis

---

## Real-World Examples

### Scenario 1: Learning a New Topic
```
1. Search: "What's the latest on machine learning?"
   → Get current news and trends
2. Ask Gemini: "Explain transformers in ML"
   → Get detailed explanation
3. Document: Select a research paper
   → Analyze and summarize
4. Generate: "Create study questions"
   → Get a quiz to test yourself
```

### Scenario 2: Work/Study Support
```
1. Have a PDF syllabus
2. Document Analyzer: "Summarize this course"
3. Generate study questions
4. Ask Gemini about concepts you don't understand
5. Gemini Search: Look up recent research on topics
```

### Scenario 3: Quick Information Lookup
```
1. Web Search: "Python list methods"
   → Quick links and facts
2. Gemini API: "Best practices for X"
   → Detailed explanation
3. Done in under 10 seconds!
```

### Scenario 4: Daily News Briefing
```
1. Gemini Search: "Latest tech news"
2. Gemini Search: "Latest cricket updates"
3. Gemini Search: "Stock market news"
4. Get all current info in 1-2 minutes
```

---

## API Quota Management

### Free Tier Limits

**Gemini (all skills using it):**
- 10 requests/minute
- 500 requests/day
- Shared across Gemini API, Gemini Search, Document Analyzer
- Resets daily at UTC midnight

**Web Search:**
- DuckDuckGo: Unlimited
- Wikipedia: Unlimited
- Hacker News: Unlimited
- **Total: Completely unlimited, no quota**

### Tips to Manage Quota
1. Use **Web Search** for quick facts (doesn't use quota)
2. Use **Gemini API** for complex thinking (worth the quota)
3. Batch document analysis (multiple questions per document)
4. Skip the obvious (don't ask Gemini basic facts)

### Monitor Usage
- Go to: https://aistudio.google.com/app/apikeys
- See daily usage and quota remaining
- Upgrade anytime if needed

---

## Installation Order (Recommended)

1. **Start with:** `google-web-search` (no setup needed)
2. **Then add:** `gemini-api` (simplest, test basic usage)
3. **Then add:** `gemini-search` (web + AI combined)
4. **Finally:** `document-analyzer` (more advanced use case)

This way you learn each skill incrementally and verify setup at each step.

---

## Troubleshooting by Skill

### Gemini API Issues
- "Invalid API key" → Check key at aistudio.google.com
- "Quota exceeded" → Free tier is 500/day, wait 24 hours
- "No response" → Check internet, API may be down

### Gemini Search Issues
- "No web results" → Try different search terms
- "Outdated information" → Search results are live, Gemini reasoning may reference training data
- "Timeout" → Search took too long, retry

### Document Analyzer Issues
- "Can't read PDF" → Try text-based PDF, not scanned
- "Incomplete text" → PDF may be image-based, try OCR-processing first
- "File too large" → Max 20MB, compress if needed

### Web Search Issues
- "No results" → Try simpler keywords
- "CORS error" → This shouldn't happen (uses public APIs)
- "Timeout" → Retry, search APIs can be slow

---

**Happy learning and exploring! 🎓🚀**
