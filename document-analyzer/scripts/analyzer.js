/**
 * document-analyzer skill — scripts/analyzer.js
 *
 * Analyzes local PDFs and images using Gemini 2.5 Flash.
 * Supports: read/extract, summarize, answer questions, generate quiz questions.
 *
 * Note: Edge Gallery provides file input via native UI — this script processes
 * the file data passed to it and sends to Gemini for analysis.
 *
 * Entry points:
 *   - analyzeDocument(action, fileData, userInput, apiKey)
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

/**
 * Main analyzer function. Edge Gallery passes the file as base64-encoded data.
 *
 * @param {string} action    - "read", "summarize", "question", "generate_questions"
 * @param {string} fileData  - base64-encoded file content (PDF or image)
 * @param {string} fileType  - "pdf" or "image" (with mime type like "application/pdf" or "image/jpeg")
 * @param {string} userInput - optional user prompt/question (used for "question" and "summarize" with length)
 * @param {string} apiKey    - Gemini API key
 * @returns {Promise<string>} - JSON response
 */
async function analyzeDocument(action, fileData, fileType, userInput, apiKey) {
  if (!apiKey || apiKey.trim() === "") {
    return JSON.stringify({
      success: false,
      error: "No Gemini API key provided.",
      help: "Get a free key at https://aistudio.google.com/apikey"
    });
  }

  if (!fileData || fileData.trim() === "") {
    return JSON.stringify({
      success: false,
      error: "No file data provided. Please select a PDF or image file."
    });
  }

  if (!action || ["read", "summarize", "question", "generate_questions"].indexOf(action) === -1) {
    return JSON.stringify({
      success: false,
      error: "Invalid action. Use: read, summarize, question, or generate_questions"
    });
  }

  // Determine MIME type and prepare document for Gemini
  var mimeType = determineMimeType(fileType);
  var documentType = mimeType.indexOf("pdf") !== -1 ? "pdf" : "image";

  // Build the prompt based on action
  var prompt = buildPrompt(action, userInput, documentType);

  // Call Gemini with the document
  var result = await callGeminiWithDocument(
    action,
    fileData,
    mimeType,
    prompt,
    apiKey
  );

  if (!result.success) {
    return JSON.stringify(result);
  }

  return JSON.stringify({
    success: true,
    action: action,
    result: result.text,
    model: result.model,
    documentType: documentType
  });
}

// ─────────────────────────────────────────────
// PROMPT BUILDERS
// ─────────────────────────────────────────────

function buildPrompt(action, userInput, docType) {
  var docName = docType === "pdf" ? "PDF document" : "image";

  switch (action) {
    case "read":
      return "Please read and extract ALL the text content from this " + docName + ". "
        + "Return the complete text in a well-organized format, preserving structure where possible.";

    case "summarize":
      var length = "medium";
      if (userInput && userInput.toLowerCase().indexOf("short") !== -1) length = "short";
      if (userInput && userInput.toLowerCase().indexOf("long") !== -1) length = "long";
      if (userInput && userInput.toLowerCase().indexOf("detailed") !== -1) length = "long";

      var lengthGuide = length === "short" ? "2-3 sentences" 
                      : length === "long" ? "1-2 paragraphs with details"
                      : "4-6 sentences";

      return "Please provide a " + length + " summary of this " + docName + ". "
        + "Focus on the main ideas and key points. " + lengthGuide + ". "
        + "Write it in clear, concise language.";

    case "question":
      if (!userInput || userInput.trim() === "") {
        return "Please answer the following question based on the content of this " + docName + ": [Question not provided]";
      }
      return "Based on the content of this " + docName + ", please answer this question:\n\n"
        + userInput + "\n\nProvide a clear, detailed answer based only on what is in the document.";

    case "generate_questions":
      return "Based on the content of this " + docName + ", generate 5 study questions. "
        + "Include a mix of: 2 multiple choice questions (with 4 options each), "
        + "2 short answer questions, and 1 essay/discussion question. "
        + "Format each question clearly with its type. Also provide brief answer hints.";

    default:
      return "Analyze this " + docName + ".";
  }
}

// ─────────────────────────────────────────────
// GEMINI API WITH DOCUMENT SUPPORT
// ─────────────────────────────────────────────

async function callGeminiWithDocument(action, fileData, mimeType, prompt, apiKey) {
  // Try each model in fallback order
  for (var i = 0; i < MODELS.length; i++) {
    var result = await callGeminiSingle(MODELS[i], fileData, mimeType, prompt, apiKey);
    if (result.success) return result;

    // Stop trying if auth/quota error
    if (result.errorCode === 401 || result.errorCode === 403 || result.errorCode === 429) {
      return result;
    }
    // 404 = model unavailable, try next
  }

  return { success: false, errorCode: 0, error: "All Gemini models unavailable." };
}

async function callGeminiSingle(model, fileData, mimeType, prompt, apiKey) {
  var url = GEMINI_BASE + "/" + model + ":generateContent?key=" + apiKey;

  // Build request with inline document data
  var body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: fileData  // base64-encoded file content
            }
          },
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 2048,  // Larger limit for document analysis
      temperature: 0.5,
      topP: 0.95
    },
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
    } else if (code === 400 || status === "INVALID_ARGUMENT") {
      error = "Invalid file format or file too large. Supported: PDF, JPG, PNG, GIF, WebP (max 20MB per file).";
    } else if (code === 404) {
      error = "Model not available, trying next.";
    }

    return { success: false, errorCode: code, error: error, help: help };
  }

  var candidate = data.candidates && data.candidates[0];
  if (!candidate) return { success: false, errorCode: 0, error: "No response from Gemini." };
  if (candidate.finishReason === "SAFETY") return { success: false, errorCode: 0, error: "Response blocked by safety filters." };

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

function determineMimeType(fileType) {
  if (!fileType) return "application/pdf";

  var lower = fileType.toLowerCase();

  // PDF
  if (lower.indexOf("pdf") !== -1) return "application/pdf";

  // Images
  if (lower.indexOf("jpeg") !== -1 || lower.indexOf("jpg") !== -1) return "image/jpeg";
  if (lower.indexOf("png") !== -1) return "image/png";
  if (lower.indexOf("gif") !== -1) return "image/gif";
  if (lower.indexOf("webp") !== -1) return "image/webp";

  // Default to PDF if unclear
  return "application/pdf";
}

/**
 * Optional: Batch analyze multiple files (advanced usage)
 * Not exposed in basic skill but available for future extensions
 */
async function analyzeMultipleDocuments(files, action, apiKey) {
  var results = [];
  for (var i = 0; i < files.length; i++) {
    var r = await analyzeDocument(action, files[i].data, files[i].type, "", apiKey);
    results.push(JSON.parse(r));
  }
  return JSON.stringify({ success: true, results: results, fileCount: files.length });
}
