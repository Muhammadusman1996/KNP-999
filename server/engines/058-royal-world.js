import crypto from "node:crypto";
// Standalone server engine for Royal World (Game #58); no shared profile resolver.
const GAME={id:58,name:"Royal World",profile:"card",variant:"royal-world",rules:{"engineId": "knp-058-royal-world", "title": "Royal World", "objective": "Royal World: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 273, "difficulty": 4, "target": 5, "risk": 0.14, "reward": 7.47, "sequenceLength": 5, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 4, "range": 6, "rounds": 5, "difficulty": 3, "winRate": 37, "base": 2.07, "bonus": 7.72, "symbols": 11, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?7.72:2.07):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
