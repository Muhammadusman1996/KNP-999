import crypto from "node:crypto";
// Standalone server engine for Pearl Blitz (Game #37); no shared profile resolver.
const GAME={id:37,name:"Pearl Blitz",profile:"fishing",variant:"pearl-blitz",rules:{"engineId": "knp-037-pearl-blitz", "title": "Pearl Blitz", "objective": "Pearl Blitz: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 493, "difficulty": 3, "target": 8, "risk": 0.44, "reward": 3.02, "sequenceLength": 5, "symbolCount": 8}, "uniqueRuleVersion": 2},parameters:{"target": 19, "range": 7, "rounds": 8, "difficulty": 3, "winRate": 67, "base": 3.72, "bonus": 3.27, "symbols": 8, "lanes": 5, "sequence": 5}};
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
