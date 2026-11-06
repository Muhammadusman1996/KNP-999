import crypto from "node:crypto";
// Standalone server engine for Diamond Hunt (Game #23); no shared profile resolver.
const GAME={id:23,name:"Diamond Hunt",profile:"arcade",variant:"diamond-hunt",rules:{"engineId": "knp-023-diamond-hunt", "title": "Diamond Hunt", "objective": "Diamond Hunt: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 983, "difficulty": 4, "target": 3, "risk": 0.41, "reward": 5.74, "sequenceLength": 7, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 15, "range": 5, "rounds": 8, "difficulty": 5, "winRate": 64, "base": 2.34, "bonus": 5.99, "symbols": 12, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:7},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?5.99:partial>=Math.ceil(sequence.length*.7)?2.34:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
