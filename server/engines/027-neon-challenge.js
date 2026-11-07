import crypto from "node:crypto";
// Standalone server engine for Neon Challenge (Game #27); no shared profile resolver.
const GAME={id:27,name:"Neon Challenge",profile:"crash",variant:"neon-challenge",rules:{"engineId": "knp-027-neon-challenge", "title": "Neon Challenge", "objective": "Neon Challenge: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 156, "difficulty": 3, "target": 2, "risk": 0.33, "reward": 5.76, "sequenceLength": 4, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 8, "range": 6, "rounds": 6, "difficulty": 2, "winRate": 56, "base": 3.16, "bonus": 6.01, "symbols": 10, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const columns=Array.from({length:4},()=>crypto.randomInt(0,4));
      const pick=Number(choice.lane??-1),count=columns.filter(x=>x===pick).length;
      multiplier=count>=2?Number((3.16*count).toFixed(2)):0;
      result={...result,mechanic:"Lane convergence",columns,pick,count};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
