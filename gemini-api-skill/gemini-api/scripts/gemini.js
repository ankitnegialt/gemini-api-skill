/**
 * gemini-api skill — scripts/gemini.js
 *
 * Runs inside the Google AI Edge Gallery hidden webview.
 * Calls the Google Gemini REST API and returns the response.
 *
 * The API key is passed in by the app's secure secret mechanism —
 * never hardcoded, never logged, never returned to the user.
 *
 * Entry point: askGemini(prompt, apiKey, options)
 */

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Models to try in order (fallback chain)
// Gemini 2.0 Flash was deprecated June 2026 — using 2.5 as primary
const MODEL_CHAIN = [
  "gemini-2.5-flash-preview-05-20",
  "gemini-2.5-flash-lite-preview-06-17",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b"
];

/**
 * Main entry function — called by the Edge Gallery agent runtime.
 *
 * @param {string} prompt   - The user's prompt to send to Gemini
 * @param {string} apiKey   - Injected securely by Edge Gallery (require-secret)
 * @param {object} options  - Optional overrides
 *   @param {string} options.system      - System instruction (default: helpful assistant)
 *   @param {string} options.model       - Force a specific model
 *   @param {number} options.maxTokens   - Max output tokens (default: 2048)
 *   @param {number} options.temperature - Temperature 0.0–2.0 (default: 1.0)
 * @returns {Promise<string>} - JSON string with response details
 */
async function askGemini(prompt, apiKey, options = {}) {
  if (!apiKey || apiKey.trim() === "") {
    return JSON.stringify({
      success: false,
      error: "No API key provided. Please set your Gemini API key in the skill settings.",
      help: "Get a free key at https://aistudio.google.com/apikey"
    });
  }

  if (!prompt || prompt.trim() === "") {
    return JSON.stringify({ success: false, error: "Prompt cannot be empty." });
  }

  const {
    system = "You are a helpful, accurate, and concise assistant.",
    model = null,
    maxTokens = 2048,
    temperature = 1.0
  } = options;

  // Build the request body
  const requestBody = {
    system_instruction: {
      parts: [{ text: system }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: temperature,
      topP: 0.95
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
    ]
  };

  // Try models in fallback chain
  const modelsToTry = model ? [model] : MODEL_CHAIN;

  for (const modelName of modelsToTry) {
    try {
      const result = await callGeminiAPI(modelName, requestBody, apiKey);
      if (result.success) {
        return JSON.stringify(result);
      }
      // If quota/auth error, don't try more models — same key won't work
      if (result.errorCode === 401 || result.errorCode === 403) {
        return JSON.stringify(result);
      }
      // 404 means model not available — try next
      if (result.errorCode === 404) continue;
      // Other errors — try next model
      continue;
    } catch (e) {
      if (modelName === modelsToTry[modelsToTry.length - 1]) {
        // Last model — return the error
        return JSON.stringify({
          success: false,
          error: `Network error: ${e.message}`,
          help: "Check your internet connection and try again."
        });
      }
    }
  }

  return JSON.stringify({
    success: false,
    error: "All Gemini models are currently unavailable. Please try again later."
  });
}

/**
 * Make a single API call to a specific Gemini model.
 * @param {string} modelName  - e.g. "gemini-2.0-flash"
 * @param {object} body       - Request body
 * @param {string} apiKey     - Gemini API key
 * @returns {Promise<object>} - Result object
 */
async function callGeminiAPI(modelName, body, apiKey) {
  const url = `${GEMINI_BASE}/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-client": "edge-gallery-skill/1.0"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  // Handle API-level errors
  if (!response.ok) {
    const errMsg = data?.error?.message || `HTTP ${response.status}`;
    const errCode = data?.error?.code || response.status;
    const errStatus = data?.error?.status || "";

    let userMessage = errMsg;
    let helpText = "";

    if (errCode === 400) {
      userMessage = "Invalid request. The prompt may be too long or contain unsupported content.";
    } else if (errCode === 401 || errCode === 403 || errStatus === "PERMISSION_DENIED") {
      userMessage = "Invalid or unauthorized API key.";
      helpText = "Get a free key at https://aistudio.google.com/apikey";
    } else if (errCode === 429 || errStatus === "RESOURCE_EXHAUSTED") {
      userMessage = "Gemini API quota exceeded. You've hit the free tier limit.";
      helpText = "Wait a minute and try again, or upgrade at https://aistudio.google.com";
    } else if (errCode === 404) {
      userMessage = `Model '${modelName}' not available.`;
    } else if (errCode >= 500) {
      userMessage = "Gemini service is temporarily unavailable. Please try again shortly.";
    }

    return { success: false, errorCode: errCode, error: userMessage, help: helpText };
  }

  // Parse successful response
  const candidate = data?.candidates?.[0];

  if (!candidate) {
    return { success: false, error: "Gemini returned no response candidates.", errorCode: 0 };
  }

  // Check finish reason
  const finishReason = candidate.finishReason;
  if (finishReason === "SAFETY") {
    return {
      success: false,
      error: "Gemini blocked this response due to safety filters.",
      errorCode: 0
    };
  }

  // Extract text from parts
  const parts = candidate?.content?.parts || [];
  const responseText = parts
    .filter(p => p.text)
    .map(p => p.text)
    .join("");

  if (!responseText) {
    return { success: false, error: "Gemini returned an empty response.", errorCode: 0 };
  }

  // Usage metadata
  const usage = data?.usageMetadata || {};

  return {
    success: true,
    model: modelName,
    response: responseText,
    finishReason: finishReason || "STOP",
    usage: {
      promptTokens: usage.promptTokenCount || 0,
      responseTokens: usage.candidatesTokenCount || 0,
      totalTokens: usage.totalTokenCount || 0
    }
  };
}

/**
 * Multi-turn conversation support.
 * Pass a full history array to maintain context across turns.
 *
 * @param {Array}  history  - Array of {role: "user"|"model", text: "..."}
 * @param {string} apiKey   - Gemini API key
 * @param {object} options  - Same options as askGemini
 * @returns {Promise<string>} - JSON string with response
 */
async function askGeminiWithHistory(history, apiKey, options = {}) {
  if (!history || history.length === 0) {
    return JSON.stringify({ success: false, error: "History cannot be empty." });
  }

  const {
    system = "You are a helpful, accurate, and concise assistant.",
    model = "gemini-2.0-flash",
    maxTokens = 2048,
    temperature = 1.0
  } = options;

  const contents = history.map(turn => ({
    role: turn.role === "assistant" ? "model" : turn.role,
    parts: [{ text: turn.text }]
  }));

  const requestBody = {
    system_instruction: { parts: [{ text: system }] },
    contents,
    generationConfig: { maxOutputTokens: maxTokens, temperature, topP: 0.95 }
  };

  try {
    const result = await callGeminiAPI(model, requestBody, apiKey);
    return JSON.stringify(result);
  } catch (e) {
    return JSON.stringify({ success: false, error: `Network error: ${e.message}` });
  }
}
