import crypto from "node:crypto";
// Standalone server engine for football-golden-cup (Game #195); no shared profile resolver.
const GAME={id:195,name:"Football Golden Cup",profile:"arcade",variant:"football-golden-cup",rules:{"engineId": "knp-195-football-golden-cup", "title": "Football Golden Cup", "objective": "Football Golden Cup: Golden Cup Shootout", "instructions": "Take virtual penalty shots and aim for the golden cup.", "mechanic": "Golden Cup Shootout", "parameters": {"mode": 53, "difficulty": 1, "target": 3, "risk": 0.6, "reward": 5.7, "sequenceLength": 4, "symbolCount": 12}, "uniqueRuleVersion": 1},parameters:{"target": 4, "range": 10, "rounds": 6, "difficulty": 1, "winRate": 55, "base": 1.8, "bonus": 6.5, "symbols": 12, "lanes": 4, "sequence": 7}}
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
