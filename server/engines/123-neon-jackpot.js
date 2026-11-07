import crypto from "node:crypto";
// Standalone server engine for Neon Jackpot (Game #123); no shared profile resolver.
const GAME={id:123,name:"Neon Jackpot",profile:"crash",variant:"neon-jackpot",rules:{"engineId": "knp-123-neon-jackpot", "title": "Neon Jackpot", "objective": "Neon Jackpot: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 695, "difficulty": 4, "target": 4, "risk": 0.53, "reward": 3.36, "sequenceLength": 4, "symbolCount": 8}, "uniqueRuleVersion": 2},parameters:{"target": 17, "range": 18, "rounds": 8, "difficulty": 2, "winRate": 76, "base": 3.36, "bonus": 3.61, "symbols": 8, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:4},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?3.61:partial>=Math.ceil(sequence.length*.7)?3.36:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
