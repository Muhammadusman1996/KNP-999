import crypto from "node:crypto";
// Standalone server engine for thai-hilo (Game #180); no shared profile resolver.
const GAME={id:180,name:"Thai Hilo",profile:"dice",variant:"thai-hilo",rules:{"engineId": "knp-180-thai-hilo", "title": "Thai Hilo", "objective": "Thai Hilo: Hi Lo Dice", "instructions": "Choose high, low or equal before the dice roll.", "mechanic": "Hi Lo Dice", "parameters": {"mode": 49, "difficulty": 1, "target": 14, "risk": 0.45, "reward": 4.2, "sequenceLength": 4, "symbolCount": 11}, "uniqueRuleVersion": 1},parameters:{"target": 4, "range": 10, "rounds": 3, "difficulty": 1, "winRate": 40, "base": 1.2, "bonus": 1.5, "symbols": 11, "lanes": 4, "sequence": 4}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?6.83:2.18):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
