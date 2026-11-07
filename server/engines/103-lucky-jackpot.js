import crypto from "node:crypto";
// Standalone server engine for Lucky Jackpot (Game #103); no shared profile resolver.
const GAME={id:103,name:"Lucky Jackpot",profile:"dice",variant:"lucky-jackpot",rules:{"engineId": "knp-103-lucky-jackpot", "title": "Lucky Jackpot", "objective": "Lucky Jackpot: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 963, "difficulty": 4, "target": 8, "risk": 0.23, "reward": 1.41, "sequenceLength": 4, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 8, "range": 10, "rounds": 5, "difficulty": 2, "winRate": 46, "base": 2.61, "bonus": 1.66, "symbols": 11, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:4},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?1.66:partial>=Math.ceil(sequence.length*.7)?2.61:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
