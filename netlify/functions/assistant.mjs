export default async (req) => {
  const headers = { "content-type": "application/json", "cache-control": "no-store" };
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "AI assistant is not configured yet. Please contact Safi Laundry." }), { status: 503, headers });
  let body;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "Invalid request." }), { status: 400, headers }); }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  if (!messages.length || messages.some(m => !["user","model"].includes(m.role) || typeof m.text !== "string" || m.text.length > 1200)) {
    return new Response(JSON.stringify({ error: "Please send a shorter message." }), { status: 400, headers });
  }
  const contents = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
  const system = "You are the friendly Safi Laundry customer assistant for a laundry service in Addis Ababa, Ethiopia. Answer clearly and briefly. Help with Safi services, booking steps, order-code explanations, pickup preparation, and general garment-care guidance. Never invent a customer's order status, prices, opening hours, delivery availability, or booking confirmation. You cannot access customer accounts or track orders; direct customers to sign in to their Safi account and use their unique order code. Prices are confirmed after garment inspection. For delicate, valuable, stained, damaged, or uncertain fabrics, recommend asking Safi staff before washing. Do not provide medical, chemical-mixing, or hazardous cleaning instructions. Be honest that Yango delivery is currently a manual handoff and not automatically booked by this chat. If you do not know, say so and recommend contacting Safi staff.";
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(key), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { temperature: 0.4, maxOutputTokens: 450 } })
    });
    if (!response.ok) return new Response(JSON.stringify({ error: "The assistant is temporarily unavailable. Please try again shortly." }), { status: 502, headers });
    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
    if (!answer) throw new Error("Empty model response");
    return new Response(JSON.stringify({ answer }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ error: "The assistant is temporarily unavailable. Please try again shortly." }), { status: 502, headers });
  }
};
