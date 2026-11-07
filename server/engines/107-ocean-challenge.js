import crypto from "node:crypto";
// Standalone server engine for Ocean Challenge (Game #107); no shared profile resolver.
const GAME={id:107,name:"Ocean Challenge",profile:"crash",variant:"ocean-challenge",rules:{"engineId": "knp-107-ocean-challenge", "title": "Ocean Challenge", "objective": "Ocean Challenge: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 136, "difficulty": 3, "target": 11, "risk": 0.44, "reward": 6.42, "sequenceLength": 5, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 4, "range": 7, "rounds": 8, "difficulty": 3, "winRate": 67, "base": 3.72, "bonus": 6.67, "symbols": 10, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const columns=Array.from({length:4},()=>crypto.randomInt(0,5));
      const pick=Number(choice.lane??-1),count=columns.filter(x=>x===pick).length;
      multiplier=count>=2?Number((3.72*count).toFixed(2)):0;
      result={...result,mechanic:"Lane convergence",columns,pick,count};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
