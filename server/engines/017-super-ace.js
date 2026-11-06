import crypto from "node:crypto";
// Standalone server engine for Super Ace (Game #17); no shared profile resolver.
const GAME={id:17,name:"Super Ace",profile:"blackjack",variant:"super-ace",rules:{"engineId": "knp-017-super-ace", "title": "Super Ace", "objective": "Super Ace: Risk Ladder", "instructions": "Choose how many stages to attempt; each stage increases reward and failure risk.", "mechanic": "Risk Ladder", "parameters": {"mode": 728, "difficulty": 3, "target": 7, "risk": 0.46, "reward": 4.14, "sequenceLength": 7, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 21, "rounds": 4, "difficulty": 5, "winRate": 69, "base": 3.74, "bonus": 4.39, "symbols": 6, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const columns=Array.from({length:4},()=>crypto.randomInt(0,7));
      const pick=Number(choice.lane??-1),count=columns.filter(x=>x===pick).length;
      multiplier=count>=2?Number((3.74*count).toFixed(2)):0;
      result={...result,mechanic:"Lane convergence",columns,pick,count};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
