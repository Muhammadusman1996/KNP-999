import crypto from "node:crypto";
// Standalone server engine for Lucky Challenge (Game #127); no shared profile resolver.
const GAME={id:127,name:"Lucky Challenge",profile:"dice",variant:"lucky-challenge",rules:{"engineId": "knp-127-lucky-challenge", "title": "Lucky Challenge", "objective": "Lucky Challenge: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 876, "difficulty": 3, "target": 10, "risk": 0.13, "reward": 2.31, "sequenceLength": 4, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 8, "rounds": 7, "difficulty": 2, "winRate": 36, "base": 1.61, "bonus": 2.56, "symbols": 5, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const columns=Array.from({length:4},()=>crypto.randomInt(0,4));
      const pick=Number(choice.lane??-1),count=columns.filter(x=>x===pick).length;
      multiplier=count>=2?Number((1.61*count).toFixed(2)):0;
      result={...result,mechanic:"Lane convergence",columns,pick,count};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
