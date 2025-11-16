/* eslint-env node */

const { onRequest } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY')

// POST /api/ai/chat
// body: { prompt: string, model?: string, systemInstruction?: string, safetySettings?, generationConfig? }
exports.aiApi = onRequest({ region: 'us-central1', secrets: [GEMINI_API_KEY] }, async (req, res) => {
  // Basic CORS (adjust origin for production)
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { prompt, model = 'gemini-2.5-flash', systemInstruction, safetySettings, generationConfig } = req.body || {}
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'prompt is required' })
      return
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.value())
    const genModel = genAI.getGenerativeModel({ model, systemInstruction, safetySettings, generationConfig })

    const result = await genModel.generateContent(prompt)
    const text = result?.response?.text?.() ?? ''

    res.json({ ok: true, model, text })
  } catch (err) {
    console.error('[aiApi] error', err)
    const message = err && typeof err === 'object' && 'message' in err ? err.message : 'Internal error'
    res.status(500).json({ ok: false, error: message })
  }
})
