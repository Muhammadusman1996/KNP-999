import crypto from "node:crypto";
// Standalone server engine for Mega Kingdom (Game #128); no shared profile resolver.
const GAME={id:128,name:"Mega Kingdom",profile:"arcade",variant:"mega-kingdom",rules:{"engineId": "knp-128-mega-kingdom", "title": "Mega Kingdom", "objective": "Mega Kingdom: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 880, "difficulty": 4, "target": 3, "risk": 0.54, "reward": 3.92, "sequenceLength": 5, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 20, "rounds": 6, "difficulty": 3, "winRate": 77, "base": 2.02, "bonus": 4.17, "symbols": 12, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?4.17:2.02):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
