import crypto from "node:crypto";
// Standalone server engine for Fire Treasures (Game #84); no shared profile resolver.
const GAME={id:84,name:"Fire Treasures",profile:"wheel",variant:"fire-treasures",rules:{"engineId": "knp-084-fire-treasures", "title": "Fire Treasures", "objective": "Fire Treasures: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 271, "difficulty": 5, "target": 3, "risk": 0.55, "reward": 3.53, "sequenceLength": 6, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 3, "range": 22, "rounds": 7, "difficulty": 4, "winRate": 78, "base": 2.03, "bonus": 3.78, "symbols": 7, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?3.78:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
