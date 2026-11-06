import crypto from "node:crypto";
// Standalone server engine for Dragon Treasures (Game #124); no shared profile resolver.
const GAME={id:124,name:"Dragon Treasures",profile:"wheel",variant:"dragon-treasures",rules:{"engineId": "knp-124-dragon-treasures", "title": "Dragon Treasures", "objective": "Dragon Treasures: Risk Ladder", "instructions": "Choose how many stages to attempt; each stage increases reward and failure risk.", "mechanic": "Risk Ladder", "parameters": {"mode": 776, "difficulty": 5, "target": 9, "risk": 0.31, "reward": 4.49, "sequenceLength": 7, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 3, "range": 22, "rounds": 7, "difficulty": 5, "winRate": 54, "base": 3.59, "bonus": 4.74, "symbols": 7, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?4.74:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
