// Shared KNP-999 wallet client. Server-side Cloud Functions enforce all coin changes.
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js';
const cfg=window.KNP_FIREBASE_CONFIG;
if(!cfg || !cfg.apiKey || cfg.apiKey.startsWith('PASTE_')) throw new Error('KNP Firebase config missing.');
const app=getApps().length?getApps()[0]:initializeApp(cfg);const auth=getAuth(app);const functions=getFunctions(app);
const call=(name,data)=>httpsCallable(functions,name)(data).then(r=>r.data);
const ready=new Promise((resolve,reject)=>{const stop=onAuthStateChanged(auth,u=>{stop();if(u)resolve(u);else reject(new Error('Please login to your KNP-999 account first.'));});});
window.KNPWallet={
 ready,
 async balance(){await ready;return (await call('getWallet',{})).coins;},
 async debit(game,amount){await ready;return (await call('placeBet',{game,amount:Math.round(Number(amount))})).coins;},
 async credit(game,amount,roundId){await ready;return (await call('settleWin',{game,amount:Math.round(Number(amount)),roundId})).coins;},
 async adminAdd(uid,amount){await ready;return (await call('adminAddCoins',{uid,amount:Math.round(Number(amount))})).coins;}
};
