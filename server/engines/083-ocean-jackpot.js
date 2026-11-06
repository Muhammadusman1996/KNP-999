import crypto from "node:crypto";
// Standalone server engine for Ocean Jackpot (Game #83); no shared profile resolver.
const GAME={id:83,name:"Ocean Jackpot",profile:"crash",variant:"ocean-jackpot",rules:{"engineId": "knp-083-ocean-jackpot", "title": "Ocean Jackpot", "objective": "Ocean Jackpot: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 223, "difficulty": 4, "target": 11, "risk": 0.53, "reward": 3.76, "sequenceLength": 4, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 19, "range": 16, "rounds": 8, "difficulty": 2, "winRate": 76, "base": 3.36, "bonus": 4.01, "symbols": 12, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:4},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?4.01:partial>=Math.ceil(sequence.length*.7)?3.36:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
