import crypto from "node:crypto";
// Standalone server engine for Moon Blitz (Game #77); no shared profile resolver.
const GAME={id:77,name:"Moon Blitz",profile:"fishing",variant:"moon-blitz",rules:{"engineId": "knp-077-moon-blitz", "title": "Moon Blitz", "objective": "Moon Blitz: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 965, "difficulty": 3, "target": 8, "risk": 0.24, "reward": 1.27, "sequenceLength": 5, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 6, "range": 20, "rounds": 3, "difficulty": 3, "winRate": 47, "base": 1.27, "bonus": 1.52, "symbols": 9, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const columns=Array.from({length:4},()=>crypto.randomInt(0,5));
      const pick=Number(choice.lane??-1),count=columns.filter(x=>x===pick).length;
      multiplier=count>=2?Number((1.27*count).toFixed(2)):0;
      result={...result,mechanic:"Lane convergence",columns,pick,count};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
