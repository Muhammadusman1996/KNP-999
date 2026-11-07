import crypto from "node:crypto";
// Standalone server engine for aviator (Game #153); no shared profile resolver.
const GAME={id:153,name:"Aviator",profile:"crash",variant:"aviator",rules:{"engineId": "knp-153-aviator", "title": "Aviator", "objective": "Aviator: Flight Multiplier", "instructions": "Start a flight round and choose when to cash out before the server-set crash point.", "mechanic": "Flight Multiplier", "parameters": {"mode": 92, "difficulty": 4, "target": 13, "risk": 0.58, "reward": 1.5, "sequenceLength": 7, "symbolCount": 12}, "uniqueRuleVersion": 1},parameters:{"target": 7, "range": 13, "rounds": 6, "difficulty": 4, "winRate": 48, "base": 3.0, "bonus": 5.83, "symbols": 12, "lanes": 7, "sequence": 5}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?3.97:1.82):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
