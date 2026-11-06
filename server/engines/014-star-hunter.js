import crypto from "node:crypto";
// Standalone server engine for Star Hunter (Game #14); no shared profile resolver.
const GAME={id:14,name:"Star Hunter",profile:"arcade",variant:"star-hunter",rules:{"engineId": "knp-014-star-hunter", "title": "Star Hunter", "objective": "Star Hunter: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 639, "difficulty": 5, "target": 10, "risk": 0.16, "reward": 3.49, "sequenceLength": 7, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 7, "range": 20, "rounds": 7, "difficulty": 5, "winRate": 39, "base": 2.99, "bonus": 3.74, "symbols": 5, "lanes": 7, "sequence": 7}};
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
