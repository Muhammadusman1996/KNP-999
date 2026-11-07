import crypto from "node:crypto";
// Standalone server engine for Cosmic World (Game #138); no shared profile resolver.
const GAME={id:138,name:"Cosmic World",profile:"card",variant:"cosmic-world",rules:{"engineId": "knp-138-cosmic-world", "title": "Cosmic World", "objective": "Cosmic World: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 253, "difficulty": 4, "target": 7, "risk": 0.52, "reward": 6.2, "sequenceLength": 3, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 7, "range": 14, "rounds": 4, "difficulty": 1, "winRate": 75, "base": 2.0, "bonus": 6.45, "symbols": 12, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?6.45:2.0):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
