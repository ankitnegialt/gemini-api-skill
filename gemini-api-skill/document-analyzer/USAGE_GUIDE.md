# Document Analyzer — Usage Guide

## Setup

1. Get a free Gemini API key: https://aistudio.google.com/apikey
2. Import the `document-analyzer` skill in Edge Gallery
3. When prompted, enter your API key

## Actions

### 1. Read / Extract Text
Extracts all text from a PDF or image.

**Prompts that trigger this:**
- "Read this PDF"
- "Extract text from this document"
- "What's in this image?"
- "Show me the text from this file"

**Output:** Complete text content, organized by structure

---

### 2. Summarize
Creates a concise summary of the document.

**Prompts:**
- "Summarize this document"
- "Give me a short summary"
- "What's the main idea of this PDF?"
- "Long summary of this file"
- "Detailed overview"

**Modifiers:**
- "short summary" → 2-3 sentences
- "medium summary" → 4-6 sentences (default)
- "long summary" or "detailed" → 1-2 paragraphs

---

### 3. Answer Question
Ask any question about the document content.

**Prompts:**
- "What is X mentioned in this document?"
- "Based on this PDF, how do I...?"
- "Does this image show...?"
- "Who is mentioned in this document?"

**Tips:**
- Be specific with your questions
- The answer is based only on document content
- Works best with clear documents

---

### 4. Generate Study Questions
Creates quiz questions from the document.

**Prompts:**
- "Generate questions from this PDF"
- "Create study questions"
- "Make a quiz from this"
- "Generate test questions"

**Output:** Mix of:
- 2 multiple choice (4 options each)
- 2 short answer
- 1 essay question
- Plus answer hints

---

## File Type Support

| Format | Support | Notes |
|--------|---------|-------|
| PDF | ✅ Yes | Text-based PDFs work best |
| JPG/JPEG | ✅ Yes | Images and scanned docs |
| PNG | ✅ Yes | Good for diagrams, charts |
| GIF | ✅ Yes | Animated GIFs work too |
| WebP | ✅ Yes | Modern image format |

**File size limit:** ~20 MB per file (Edge Gallery limit)

---

## Tips & Tricks

### For Best Results:

1. **Clear documents** → Better text extraction
2. **High contrast images** → Easier to read
3. **Well-formatted PDFs** → Cleaner output
4. **Specific questions** → More accurate answers

### For Scanned PDFs:

- If a scanned PDF isn't being read well, try:
  - Increasing image contrast (crop & brightness adjust first)
  - Using PNG format instead of PDF
  - Breaking large documents into sections

### API Quota:

- Free tier: **500 requests/day** for Gemini 2.5 Flash
- Each document analysis = 1 request
- Questions and generation count as separate requests
- Quota resets daily at UTC midnight

---

## Examples

### Example 1: Course Material Summary
```
User: "Summarize this biology chapter PDF — short version"
→ Document Analyzer reads the PDF
→ Returns 2-3 sentence summary of key concepts
```

### Example 2: Quiz Generation
```
User: "Generate study questions from this textbook chapter"
→ Analyzer creates 5 quiz questions
→ Includes multiple choice, short answer, essay
→ Provides answer hints for studying
```

### Example 3: Document Search
```
User: "What are the requirements listed in this contract image?"
→ Analyzer extracts text from image
→ Answers your specific question based on content
```

### Example 4: Full Text Extraction
```
User: "Read this scanned document to me"
→ Analyzer extracts all text
→ Returns organized, clean text version
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No file data" | Select a PDF or image file first |
| "Invalid API key" | Check key at aistudio.google.com/apikey |
| "Quota exceeded" | Wait 24 hours or upgrade at aistudio.google.com |
| "File format not supported" | Use PDF, JPG, PNG, GIF, or WebP |
| "Can't read the text" | Try a clearer/higher contrast image |

---

## API Quota Management

**Free tier includes:**
- 10 requests/minute
- 500 requests/day
- All Gemini 2.5 models

**Quota tips:**
- Each unique file analysis = 1 request
- Answering multiple questions about the same file = multiple requests
- Generate questions uses 1 request regardless of output size
