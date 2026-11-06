const TOKEN_KEY="knp999-auth-token";
// Android APK build: set VITE_API_BASE_URL to the deployed HTTPS API origin.
const API_BASE=(import.meta.env.VITE_API_BASE_URL||"").replace(/\/$/,"");
const token=()=>localStorage.getItem(TOKEN_KEY)||"";
async function req(path,opts={}){const r=await fetch(`${API_BASE}${path}`,{...opts,headers:{...(opts.headers||{}),...(token()?{authorization:"Bearer "+token()}:{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Request failed");return d;}
export async function registerCustomer(mobile,password){const d=await req("/api/auth/register",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({mobile,password})});localStorage.setItem(TOKEN_KEY,d.token);return d.user;}
export async function loginCustomer(mobile,password){const d=await req("/api/auth/login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({mobile,password})});localStorage.setItem(TOKEN_KEY,d.token);return d.user;}
export async function logoutCustomer(){try{await req("/api/auth/logout",{method:"POST"});}finally{localStorage.removeItem(TOKEN_KEY);}}
export async function getPlayerSession(){if(!token())throw Error("Login required");const d=await req("/api/auth/me");return {playerId:d.user.id,coins:d.user.coins,user:d.user};}
export async function getServerWallet(){return req("/api/wallet");}
export async function getGameHistory(){return req("/api/history");}
export async function playServerRound(gameId,stake,action,choice){return req("/api/round",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({gameId,stake,action,choice})});}
export function connectGameRoom(){throw Error("Multiplayer socket authentication not enabled");}

export async function requestBalance(amount,note=""){return req("/api/balance-requests",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({amount,note})});}
export async function getBalanceRequests(){return req("/api/balance-requests");}
