import crypto from "node:crypto";
// Standalone server engine for Solar World (Game #78); no shared profile resolver.
const GAME={id:78,name:"Solar World",profile:"slot",variant:"solar-world",rules:{"engineId": "knp-078-solar-world", "title": "Solar World", "objective": "Solar World: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 16, "difficulty": 4, "target": 9, "risk": 0.14, "reward": 6.17, "sequenceLength": 5, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 7, "range": 15, "rounds": 5, "difficulty": 3, "winRate": 37, "base": 1.17, "bonus": 6.42, "symbols": 9, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const tokens=Array.from({length:6},()=>crypto.randomInt(1,7));
      const chosen=Number(choice.token||0),sum=tokens.filter(v=>v===chosen).length;
      const parity=tokens.reduce((a,b)=>a+b,0)%2;
      multiplier=sum>=2?(parity===0?6.42:1.17):0;
      result={...result,mechanic:"Token parity",tokens,chosen,matches:sum,parity:parity?"odd":"even"};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
