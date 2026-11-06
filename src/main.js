import { registerCustomer, loginCustomer, logoutCustomer, getPlayerSession, getGameHistory, } from "./services/server.js";
import games from "./data/games.json";
import "./style.css";
const app=document.querySelector("#app");let wallet={value:100};let cleanup=null;let customer=null;
function auth(error=""){
const adminNumber="923111810070";
app.innerHTML=`<main class="shell auth-layout">
  <a class="admin-side" href="https://wa.me/${adminNumber}" target="_blank" rel="noopener" aria-label="Admin WhatsApp">
    <span class="admin-side-icon">☏</span><b>ADMIN</b><small>WhatsApp</small>
  </a>
  <section class="auth-panel">
    <section class="hero auth-intro">
      <div class="auth-brand"><img src="/assets/knp-999-logo.png" alt="KNP-999 logo"><p>KNP-999 ACCOUNT</p></div>
      <h1>Customer <em>Account</em></h1>
      <p class="auth-instruction">اکاؤنٹ بنانے یا لاگ اِن کرنے کے لیے صرف یہ دو معلومات درج کریں:</p>
      <ul class="auth-requirements"><li>موبائل نمبر — لازمی</li><li>پاس ورڈ — لازمی</li></ul>
      <span>نئے اکاؤنٹ پر 100 مفت ورچوئل Coins ملیں گے۔</span>
    </section>
    <section class="auth-card">
      <label for="authMobile">Customer Mobile Number</label>
      <input id="authMobile" type="tel" inputmode="tel" autocomplete="tel" placeholder="مثال: 03XXXXXXXXX" required>
      <label for="authPass">Customer Password</label>
      <input id="authPass" type="password" autocomplete="current-password" placeholder="پاس ورڈ درج کریں" required>
      <div class="auth-buttons">
        <button id="register" type="button">اکاؤنٹ بنائیں</button>
        <button id="login" type="button">اکاؤنٹ لاگ اِن</button>
      </div>
      <p id="authError" class="result" role="status">${error}</p>
    </section>
  </section>
</main>`;
const mobile=()=>app.querySelector("#authMobile").value.trim();
const password=()=>app.querySelector("#authPass").value;
const valid=()=>{
  const n=mobile(),p=password();
  if(!/^\+?[0-9]{10,15}$/.test(n)){app.querySelector("#authError").textContent="درست موبائل نمبر درج کریں۔";return false;}
  if(p.length<8){app.querySelector("#authError").textContent="پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے۔";return false;}
  app.querySelector("#authError").textContent="";return true;
};
app.querySelector("#register").onclick=async()=>{
  if(!valid())return;
  try{customer=await registerCustomer(mobile(),password());wallet.value=customer.coins;lobby();}
  catch(e){app.querySelector("#authError").textContent=e.message;}
};
app.querySelector("#login").onclick=async()=>{
  if(!valid())return;
  try{customer=await loginCustomer(mobile(),password());wallet.value=customer.coins;lobby();}
  catch(e){app.querySelector("#authError").textContent=e.message;}
};
}
async function showHistory(selected="all"){
  try{
    const d=await getGameHistory(), rows=d.rounds||[];
    const options=games.map(g=>`<option value="${g.id}" ${String(g.id)===String(selected)?"selected":""}>${g.name}</option>`).join("");
    const render=(gameId)=>{
      const filtered=gameId==="all"?rows:rows.filter(r=>String(r.game_id)===String(gameId));
      const body=filtered.length?filtered.map(r=>`<article class="history-row"><b>${r.game_name||"Game"}</b><span>Bet: ${Number(r.stake||0).toLocaleString()} Coins</span><span>Win: ${Number(r.payout||0).toLocaleString()} Coins</span><span>Net: ${Number(r.net||0).toLocaleString()} Coins</span><small>${r.created_at||""}</small></article>`).join(""):`<p class="history-empty">اس گیم کی ابھی کوئی ہسٹری موجود نہیں۔</p>`;
      const panel=app.querySelector("#history-list");if(panel)panel.innerHTML=body;
    };
    app.innerHTML=`<main class="shell history-page"><header class="top"><div class="brand">KNP-999 · PLAY HISTORY</div><button id="history-back">واپس</button></header><section class="hero"><h1>گیم ہسٹری</h1><p>تمام گیمز یا کسی ایک گیم کا ریکارڈ منتخب کریں۔</p></section><section class="history-filter"><label for="history-game">گیم منتخب کریں</label><select id="history-game"><option value="all" ${selected==="all"?"selected":""}>تمام گیمز</option>${options}</select></section><section id="history-list" class="history-list"></section></main>`;
    const sel=app.querySelector("#history-game");sel.onchange=()=>render(sel.value);app.querySelector("#history-back").onclick=()=>lobby();render(selected);
  }catch(e){alert(e.message||"History could not be loaded.");}
}
function lobby(filter="All",query=""){if(cleanup){cleanup();cleanup=null;}const filtered=games.filter(g=>g.name.toLowerCase().includes(query.toLowerCase()));
app.innerHTML=`<main class="shell"><header class="top"><div class="brand"><img class="brand-logo" src="/assets/knp-999-logo.png" alt="KNP-999"><span>KNP<span>-999</span></span></div><div class="wallet-pill">COIN BALANCE <b>${wallet.value.toFixed(2)}</b></div></header><section class="hero"><p>THE GAME ARENA</p><h1>Find your <em>next game.</em></h1><span>${games.length} individual game rooms · Virtual Coins only</span></section><section class="toolbar"><input id="search" placeholder="Search games..." value="${query}"></section><section class="account-actions"><span>${customer?.mobile||""} · ${customer?.email||""}</span><button id="history">میری گیم ہسٹری</button><button id="logout">لاگ آؤٹ</button></section><section class="grid">${filtered.map(g=>`<button class="game-card" data-id="${g.id}" style="--card-bg:${g.colors.background};--accent:${g.colors.accent};--glow:${g.colors.highlight}"><img src="${g.logo}" alt="${g.name} logo"><span class="category">${g.category}</span><b>${g.name}</b><small>PLAY NOW ↗</small></button>`).join("")}</section><footer>© KNP-999 · Virtual Coins only · <a class="admin-contact" href="https://wa.me/923111810070" target="_blank" rel="noopener">Admin Contact: 03111810070 · WhatsApp</a></footer></main>`;
app.querySelector("#search").oninput=e=>lobby(filter,e.target.value);app.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>launch(games.find(g=>g.id===Number(b.dataset.id))));app.querySelector("#history").onclick=showHistory;app.querySelector("#logout").onclick=async()=>{await logoutCustomer();customer=null;auth("آپ لاگ آؤٹ ہو گئے ہیں۔");};}
async function launch(game){const mod=await import(`./engines/${game.slug}.js`);app.innerHTML=`<main class="game-wrap" id="game-root"></main>`;const root=app.querySelector("#game-root");cleanup=mod.default(root,wallet);root.addEventListener("backtolobby",()=>lobby());}
getPlayerSession().then(s=>{customer=s.user;wallet.value=Number(s.coins);lobby();}).catch(()=>auth());
