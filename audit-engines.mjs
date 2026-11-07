import {getEngine} from "./server/engines/index.js";
import specs from "./src/data/game-specs.json" with {type:"json"};
let bad=[];
for (const s of specs) {
 const e=getEngine(s.gameId);
 if(!e){bad.push({id:s.gameId,error:"missing engine"});continue;}
 try {
  const r=e.resolve({stake:10,choice:{target:0,sector:0,selection:"red",pick:"red",cashoutAt:2,spins:1},action:"play"});
  if(!r || !Number.isFinite(Number(r.multiplier)) || Number(r.multiplier)<0 || !r.result) bad.push({id:s.gameId,error:"invalid response",r});
  if(r.payout!==undefined && (!Number.isFinite(Number(r.payout)) || r.payout<0)) bad.push({id:s.gameId,error:"invalid payout"});
 } catch(err){bad.push({id:s.gameId,error:err.message});}
}
console.log(JSON.stringify({total:specs.length,bad},null,2));
