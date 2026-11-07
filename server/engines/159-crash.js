import crypto from "node:crypto";
// Standalone server engine for crash (Game #159); no shared profile resolver.
const GAME={id:159,name:"Crash",profile:"crash",variant:"crash",rules:{"engineId": "knp-159-crash", "title": "Crash", "objective": "Crash: Rocket Multiplier", "instructions": "Watch the rocket multiplier rise and cash out before the crash point.", "mechanic": "Rocket Multiplier", "parameters": {"mode": 194, "difficulty": 5, "target": 6, "risk": 0.64, "reward": 2.1, "sequenceLength": 8, "symbolCount": 11}, "uniqueRuleVersion": 1},parameters:{"target": 13, "range": 19, "rounds": 6, "difficulty": 5, "winRate": 54, "base": 1.8, "bonus": 7.83, "symbols": 11, "lanes": 8, "sequence": 7}}
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
