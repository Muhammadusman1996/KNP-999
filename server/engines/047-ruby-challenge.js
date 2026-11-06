import crypto from "node:crypto";
// Standalone server engine for Ruby Challenge (Game #47); no shared profile resolver.
const GAME={id:47,name:"Ruby Challenge",profile:"dice",variant:"ruby-challenge",rules:{"engineId": "knp-047-ruby-challenge", "title": "Ruby Challenge", "objective": "Ruby Challenge: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 896, "difficulty": 3, "target": 5, "risk": 0.21, "reward": 7.14, "sequenceLength": 7, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 14, "range": 22, "rounds": 6, "difficulty": 5, "winRate": 44, "base": 1.24, "bonus": 7.39, "symbols": 12, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const columns=Array.from({length:4},()=>crypto.randomInt(0,7));
      const pick=Number(choice.lane??-1),count=columns.filter(x=>x===pick).length;
      multiplier=count>=2?Number((1.24*count).toFixed(2)):0;
      result={...result,mechanic:"Lane convergence",columns,pick,count};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
