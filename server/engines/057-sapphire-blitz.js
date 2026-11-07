import crypto from "node:crypto";
// Standalone server engine for Sapphire Blitz (Game #57); no shared profile resolver.
const GAME={id:57,name:"Sapphire Blitz",profile:"puzzle",variant:"sapphire-blitz",rules:{"engineId": "knp-057-sapphire-blitz", "title": "Sapphire Blitz", "objective": "Sapphire Blitz: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 269, "difficulty": 3, "target": 6, "risk": 0.55, "reward": 6.13, "sequenceLength": 6, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 14, "range": 9, "rounds": 7, "difficulty": 4, "winRate": 78, "base": 3.83, "bonus": 6.38, "symbols": 5, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const columns=Array.from({length:4},()=>crypto.randomInt(0,6));
      const pick=Number(choice.lane??-1),count=columns.filter(x=>x===pick).length;
      multiplier=count>=2?Number((3.83*count).toFixed(2)):0;
      result={...result,mechanic:"Lane convergence",columns,pick,count};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
