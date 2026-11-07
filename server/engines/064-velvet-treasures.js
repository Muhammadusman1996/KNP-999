import crypto from "node:crypto";
// Standalone server engine for Velvet Treasures (Game #64); no shared profile resolver.
const GAME={id:64,name:"Velvet Treasures",profile:"arcade",variant:"velvet-treasures",rules:{"engineId": "knp-064-velvet-treasures", "title": "Velvet Treasures", "objective": "Velvet Treasures: Risk Ladder", "instructions": "Choose how many stages to attempt; each stage increases reward and failure risk.", "mechanic": "Risk Ladder", "parameters": {"mode": 550, "difficulty": 5, "target": 5, "risk": 0.27, "reward": 3.3, "sequenceLength": 3, "symbolCount": 8}, "uniqueRuleVersion": 2},parameters:{"target": 13, "range": 5, "rounds": 6, "difficulty": 1, "winRate": 50, "base": 2.2, "bonus": 3.55, "symbols": 8, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?3.55:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
