import crypto from "node:crypto";
// Standalone server engine for Fire Kingdom (Game #108); no shared profile resolver.
const GAME={id:108,name:"Fire Kingdom",profile:"wheel",variant:"fire-kingdom",rules:{"engineId": "knp-108-fire-kingdom", "title": "Fire Kingdom", "objective": "Fire Kingdom: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 140, "difficulty": 4, "target": 3, "risk": 0.2, "reward": 4.38, "sequenceLength": 6, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 8, "range": 14, "rounds": 8, "difficulty": 4, "winRate": 43, "base": 2.58, "bonus": 4.63, "symbols": 10, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?4.63:2.58):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
