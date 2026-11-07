import crypto from "node:crypto";
// Standalone server engine for Fire Empire (Game #36); no shared profile resolver.
const GAME={id:36,name:"Fire Empire",profile:"wheel",variant:"fire-empire",rules:{"engineId": "knp-036-fire-empire", "title": "Fire Empire", "objective": "Fire Empire: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 456, "difficulty": 2, "target": 10, "risk": 0.38, "reward": 6.66, "sequenceLength": 4, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 17, "range": 16, "rounds": 8, "difficulty": 2, "winRate": 61, "base": 2.76, "bonus": 6.91, "symbols": 6, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,17));
      const target=Number(choice.target??17);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?6.91:distance<=2?2.76:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
