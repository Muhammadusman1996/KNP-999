import crypto from "node:crypto";
// Standalone server engine for Solar Mystery (Game #54); no shared profile resolver.
const GAME={id:54,name:"Solar Mystery",profile:"slot",variant:"solar-mystery",rules:{"engineId": "knp-054-solar-mystery", "title": "Solar Mystery", "objective": "Solar Mystery: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 147, "difficulty": 5, "target": 9, "risk": 0.46, "reward": 6.69, "sequenceLength": 7, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 9, "range": 5, "rounds": 7, "difficulty": 5, "winRate": 69, "base": 1.49, "bonus": 6.94, "symbols": 9, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?6.94:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
