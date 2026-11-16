export default async (request, context) => {
  const response = await context.next();
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;
  let html = await response.text();
  const widget = `
<style>
#safi-ai-launch{position:fixed;right:22px;bottom:22px;z-index:9998;border:0;border-radius:999px;background:#75b9f4;color:#123d64;padding:15px 19px;font:800 14px system-ui;box-shadow:0 8px 28px #123d6433;cursor:pointer}
#safi-ai-box{position:fixed;right:22px;bottom:82px;width:min(360px,calc(100vw - 28px));height:480px;max-height:70vh;background:#fff;border:1px solid #dcebe4;border-radius:20px;box-shadow:0 18px 55px #174d371f;z-index:9999;display:none;overflow:hidden;font:14px system-ui;color:#18332e}
#safi-ai-box.open{display:flex;flex-direction:column}
#safi-ai-head{background:#b8f0d7;padding:16px;font-weight:800;display:flex;justify-content:space-between;align-items:center}
#safi-ai-log{padding:14px;overflow:auto;flex:1;background:#f7fcf9}
.safi-ai-msg{padding:10px 12px;border-radius:13px;margin:8px 0;max-width:88%;line-height:1.45;white-space:pre-wrap}
.safi-ai-msg.bot{background:#e9faf2;margin-right:auto}.safi-ai-msg.user{background:#e9f4ff;margin-left:auto}
#safi-ai-form{display:flex;gap:8px;padding:12px;border-top:1px solid #e1eee8}
#safi-ai-input{min-width:0;flex:1;border:1px solid #dcebe4;border-radius:11px;padding:11px;font:inherit}
#safi-ai-send{border:0;border-radius:11px;background:#75b9f4;color:#123d64;font-weight:800;padding:0 14px;cursor:pointer}
#safi-ai-close{border:0;background:transparent;font-size:20px;cursor:pointer;color:#18332e}
</style>
<button id="safi-ai-launch" type="button" aria-label="Chat with Safi AI">✦ Ask Safi AI</button>
<section id="safi-ai-box" aria-label="Safi AI assistant" aria-live="polite">
  <header id="safi-ai-head"><span>✦ Safi Assistant</span><button id="safi-ai-close" type="button" aria-label="Close">×</button></header>
  <div id="safi-ai-log"><div class="safi-ai-msg bot">Hello! I can help with Safi services, booking steps, pickup preparation and garment-care questions. What would you like to know?</div></div>
  <form id="safi-ai-form"><input id="safi-ai-input" maxlength="1200" placeholder="Ask about laundry..." autocomplete="off" required><button id="safi-ai-send" type="submit">Send</button></form>
</section>
<script>
(()=>{const box=document.getElementById('safi-ai-box'),launch=document.getElementById('safi-ai-launch'),close=document.getElementById('safi-ai-close'),form=document.getElementById('safi-ai-form'),input=document.getElementById('safi-ai-input'),log=document.getElementById('safi-ai-log'),send=document.getElementById('safi-ai-send');if(!box||!launch)return;let messages=[];launch.onclick=()=>{box.classList.add('open');input.focus()};close.onclick=()=>box.classList.remove('open');function bubble(text,who){const el=document.createElement('div');el.className='safi-ai-msg '+who;el.textContent=text;log.appendChild(el);log.scrollTop=log.scrollHeight}form.onsubmit=async e=>{e.preventDefault();const text=input.value.trim();if(!text)return;input.value='';messages.push({role:'user',text});bubble(text,'user');send.disabled=true;send.textContent='…';try{const r=await fetch('/.netlify/functions/assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unavailable');messages.push({role:'model',text:d.answer});bubble(d.answer,'bot')}catch(err){bubble(err.message||'Sorry, the assistant is unavailable right now.','bot')}finally{send.disabled=false;send.textContent='Send'}}})();
</script>`;
  if (html.includes("</body>") && !html.includes("safi-ai-launch")) html = html.replace("</body>", widget + "</body>");
  return new Response(html, { status: response.status, statusText: response.statusText, headers: response.headers });
};
