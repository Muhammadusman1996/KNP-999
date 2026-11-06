import { registerCustomer, loginCustomer, logoutCustomer, getPlayerSession, getGameHistory, requestBalance, getBalanceRequests } from "./services/server.js";
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
async function showHistory(){try{const d=await getGameHistory();alert((d.rounds||[]).slice(0,50).map(r=>`${r.game_name}: Bet ${r.stake} | Win ${r.payout} | Net ${r.net}`).join("\n")||"ابھی کوئی گیم ہسٹری نہیں");}catch(e){alert(e.message);}}
function lobby(filter="All",query=""){if(cleanup){cleanup();cleanup=null;}const cats=["All",...new Set(games.map(g=>g.category))];const filtered=games.filter(g=>(filter==="All"||g.category===filter)&&g.name.toLowerCase().includes(query.toLowerCase()));
app.innerHTML=`<main class="shell"><header class="top"><div class="brand"><img class="brand-logo" src="/assets/knp-999-logo.png" alt="KNP-999"><span>KNP<span>-999</span></span></div><div class="wallet-pill">COIN BALANCE <b>${wallet.value.toFixed(2)}</b></div></header><section class="hero"><p>THE GAME ARENA</p><h1>Find your <em>next game.</em></h1><span>140 individual game rooms · Virtual Coins only</span></section><section class="toolbar"><input id="search" placeholder="Search games..." value="${query}"><div class="filters">${cats.map(c=>`<button class="${filter===c?"active":""}" data-cat="${c}">${c}</button>`).join("")}</div></section><section class="account-actions"><span>${customer?.mobile||""} · ${customer?.email||""}</span><button id="history">میری گیم ہسٹری</button><button id="addBalance">Add Balance</button><button id="logout">لاگ آؤٹ</button></section><section class="grid">${filtered.map(g=>`<button class="game-card" data-id="${g.id}" style="--card-bg:${g.colors.background};--accent:${g.colors.accent};--glow:${g.colors.highlight}"><img src="${g.logo}" alt="${g.name} logo"><span class="category">${g.category}</span><b>${g.name}</b><small>PLAY NOW ↗</small></button>`).join("")}</section><footer>© KNP-999 · Virtual Coins only · <a class="admin-contact" href="https://wa.me/923111810070" target="_blank" rel="noopener">Admin Contact: 03111810070 · WhatsApp</a></footer></main>`;
app.querySelector("#search").oninput=e=>lobby(filter,e.target.value);app.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>lobby(b.dataset.cat,query));app.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>launch(games.find(g=>g.id===Number(b.dataset.id))));app.querySelector("#history").onclick=showHistory;app.querySelector("#addBalance").onclick=async()=>{const amount=Number(prompt("کتنے کوائنز درکار ہیں؟ (کم از کم 10)"));if(!Number.isFinite(amount))return;const note=prompt("ادائیگی کی تفصیل / ٹرانزیکشن ID (اختیاری)")||"";try{const r=await requestBalance(amount,note);alert(r.message);const h=await getBalanceRequests();alert("آپ کی درخواستیں:\n"+(h.requests||[]).map(x=>`${x.amount} coins — ${x.status}`).join("\n"));}catch(e){alert(e.message);}};app.querySelector("#logout").onclick=async()=>{await logoutCustomer();customer=null;auth("آپ لاگ آؤٹ ہو گئے ہیں۔");};}
async function launch(game){const mod=await import(`./engines/${game.slug}.js`);app.innerHTML=`<main class="game-wrap" id="game-root"></main>`;const root=app.querySelector("#game-root");cleanup=mod.default(root,wallet);root.addEventListener("backtolobby",()=>lobby());}
getPlayerSession().then(s=>{customer=s.user;wallet.value=Number(s.coins);lobby();}).catch(()=>auth());
