# Safi AI setup

The customer-facing Safi Assistant is injected into HTML pages by a Netlify Edge Function and calls a server-side Netlify Function.

## Required Netlify environment variable
Set `GEMINI_API_KEY` in Netlify Project configuration → Environment variables. Keep it secret; do not put it in HTML, JavaScript, or GitHub.

Create a key through Google AI Studio: https://aistudio.google.com/app/apikey

After setting the variable, redeploy the site. The assistant uses Gemini 2.5 Flash. Google AI Studio availability, quotas, and pricing can change; check the current terms before relying on a free tier.

## Deployment
Netlify must build from the GitHub repository root (publish directory `.`, no build command). The repository must be linked to the existing `safilaundry` site. Do not create a replacement site.
