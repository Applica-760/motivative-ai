# Firebase Functions (Node.js) for Gemini

This folder contains a minimal HTTPS function that proxies requests from the web app to Gemini, keeping the API key on the server.

## Secret setup
Store your Gemini API key as a Functions secret:

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

## Deploy
Deploy only functions:

```bash
firebase deploy --only functions
```

If you use Hosting rewrites (recommended), you can call the function via `/api/ai/*` paths on your Hosting domain.

## Endpoint
- `POST /api/ai/chat`
  - body: `{ "prompt": string, "model?": string, "systemInstruction?": string }`
  - response: `{ ok: true, model, text }`

### Frontend minimal example (success pattern)
```ts
// Prefer defining endpoint via env:
// import.meta.env.VITE_AI_API_ENDPOINT = '/api/ai' (prod) or function URL (dev)
const endpointBase = import.meta.env.VITE_AI_API_ENDPOINT
  || (import.meta.env.DEV
    ? 'https://us-central1-motivativeai.cloudfunctions.net/aiApi'
    : '/api/ai')

const MODEL_ID = 'gemini-2.5-flash'
const prompt = 'TypeScriptとはなんですか？'

const res = await fetch(`${endpointBase}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, model: MODEL_ID }),
})
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const data = await res.json()
console.log('Gemini:', data.text)
```

## Notes
- CORS is open to `*` for simplicity; restrict it to your Hosting domain in production.
- For chat history or multi-turn flows, consider the SDK's chat APIs (`startChat`) and persist history on your backend or client as needed.
