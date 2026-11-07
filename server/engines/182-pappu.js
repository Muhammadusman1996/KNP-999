import crypto from "node:crypto";
// Standalone server engine for pappu (Game #182); no shared profile resolver.
const GAME={id:182,name:"Pappu",profile:"arcade",variant:"pappu",rules:{"engineId": "knp-182-pappu", "title": "Pappu", "objective": "Pappu: Pappu Challenge", "instructions": "Complete a short score-based arcade challenge.", "mechanic": "Pappu Challenge", "parameters": {"mode": 83, "difficulty": 3, "target": 3, "risk": 0.47, "reward": 4.4, "sequenceLength": 6, "symbolCount": 6}, "uniqueRuleVersion": 1},parameters:{"target": 6, "range": 12, "rounds": 5, "difficulty": 3, "winRate": 42, "base": 1.6, "bonus": 2.17, "symbols": 6, "lanes": 6, "sequence": 6}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?3.74:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
