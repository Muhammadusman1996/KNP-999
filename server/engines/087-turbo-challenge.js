import crypto from "node:crypto";
// Standalone server engine for Turbo Challenge (Game #87); no shared profile resolver.
const GAME={id:87,name:"Turbo Challenge",profile:"dice",variant:"turbo-challenge",rules:{"engineId": "knp-087-turbo-challenge", "title": "Turbo Challenge", "objective": "Turbo Challenge: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 393, "difficulty": 3, "target": 9, "risk": 0.33, "reward": 6.61, "sequenceLength": 4, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 11, "range": 20, "rounds": 3, "difficulty": 2, "winRate": 56, "base": 2.71, "bonus": 6.86, "symbols": 11, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const columns=Array.from({length:4},()=>crypto.randomInt(0,4));
      const pick=Number(choice.lane??-1),count=columns.filter(x=>x===pick).length;
      multiplier=count>=2?Number((2.71*count).toFixed(2)):0;
      result={...result,mechanic:"Lane convergence",columns,pick,count};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
