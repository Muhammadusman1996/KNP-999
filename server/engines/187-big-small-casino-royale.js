import crypto from "node:crypto";
// Standalone server engine for big-small-casino-royale (Game #187); no shared profile resolver.
const GAME={id:187,name:"Big Small Casino Royale",profile:"dice",variant:"big-small-casino-royale",rules:{"engineId": "knp-187-big-small-casino-royale", "title": "Big Small Casino Royale", "objective": "Big Small Casino Royale: Big Small Royale", "instructions": "Choose big or small and resolve a three-dice total.", "mechanic": "Big Small Royale", "parameters": {"mode": 168, "difficulty": 3, "target": 8, "risk": 0.52, "reward": 4.9, "sequenceLength": 6, "symbolCount": 11}, "uniqueRuleVersion": 1},parameters:{"target": 11, "range": 17, "rounds": 4, "difficulty": 3, "winRate": 47, "base": 2.6, "bonus": 3.83, "symbols": 11, "lanes": 6, "sequence": 7}}
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
