---
name: document-analyzer
description: Read, summarize, answer questions about, and generate quiz questions from PDF files and images stored on your device. Extract text, analyze content, and get AI-powered insights from documents.
require-secret: true
require-secret-description: Enter your Google Gemini API key from https://aistudio.google.com/apikey
---

# Document Analyzer

Analyze local PDFs and images using Gemini 2.5 Flash. Read, summarize, answer questions, and generate study materials.

## How it works

1. Select a PDF or image file from your device
2. Choose an action: Read, Summarize, Answer Question, or Generate Questions
3. Gemini 2.5 Flash analyzes the file and returns results

## Supported file types

- **PDF** (.pdf) — text-based PDFs recommended
- **Images** (.jpg, .jpeg, .png, .gif, .webp)

## Actions available

### Read / Extract
Extract and display all text from the document.

### Summarize
Get a concise summary of the key points (adjustable length).

### Answer Question
Ask a question about the document and get an answer based on its content.

### Generate Questions
Automatically create study questions (multiple choice, short answer, essay) from the document.

## Limitations

- Scanned PDFs (images) may require OCR preprocessing
- Very large PDFs may take longer to process
- Image quality affects text extraction accuracy
- Uses Gemini API quota (free tier: 500 requests/day)

## Tips

- For best results, use clear, well-formatted documents
- For scanned PDFs, ensure good lighting/contrast
- Questions should be specific for better answers