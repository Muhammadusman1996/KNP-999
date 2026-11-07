import crypto from "node:crypto";
// Standalone server engine for Star Mystery (Game #94); no shared profile resolver.
const GAME={id:94,name:"Star Mystery",profile:"slot",variant:"star-mystery",rules:{"engineId": "knp-094-star-mystery", "title": "Star Mystery", "objective": "Star Mystery: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 619, "difficulty": 5, "target": 7, "risk": 0.25, "reward": 3.13, "sequenceLength": 6, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 9, "range": 17, "rounds": 7, "difficulty": 4, "winRate": 48, "base": 3.53, "bonus": 3.38, "symbols": 5, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?3.38:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
