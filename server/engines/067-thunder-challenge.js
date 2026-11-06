import crypto from "node:crypto";
// Standalone server engine for Thunder Challenge (Game #67); no shared profile resolver.
const GAME={id:67,name:"Thunder Challenge",profile:"crash",variant:"thunder-challenge",rules:{"engineId": "knp-067-thunder-challenge", "title": "Thunder Challenge", "objective": "Thunder Challenge: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 672, "difficulty": 3, "target": 5, "risk": 0.23, "reward": 6.51, "sequenceLength": 4, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 20, "rounds": 5, "difficulty": 2, "winRate": 46, "base": 1.71, "bonus": 6.76, "symbols": 11, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const columns=Array.from({length:4},()=>crypto.randomInt(0,4));
      const pick=Number(choice.lane??-1),count=columns.filter(x=>x===pick).length;
      multiplier=count>=2?Number((1.71*count).toFixed(2)):0;
      result={...result,mechanic:"Lane convergence",columns,pick,count};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
