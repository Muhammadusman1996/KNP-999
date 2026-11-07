import crypto from "node:crypto";
// Standalone server engine for Royal Mystery (Game #34); no shared profile resolver.
const GAME={id:34,name:"Royal Mystery",profile:"card",variant:"royal-mystery",rules:{"engineId": "knp-034-royal-mystery", "title": "Royal Mystery", "objective": "Royal Mystery: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 404, "difficulty": 5, "target": 4, "risk": 0.12, "reward": 5.75, "sequenceLength": 3, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 19, "range": 18, "rounds": 3, "difficulty": 1, "winRate": 35, "base": 1.15, "bonus": 6.0, "symbols": 5, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?6.0:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
