import crypto from "node:crypto";
// Standalone server engine for Jade Legends (Game #93); no shared profile resolver.
const GAME={id:93,name:"Jade Legends",profile:"fishing",variant:"jade-legends",rules:{"engineId": "knp-093-jade-legends", "title": "Jade Legends", "objective": "Jade Legends: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 582, "difficulty": 4, "target": 4, "risk": 0.49, "reward": 5.82, "sequenceLength": 5, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 16, "range": 20, "rounds": 4, "difficulty": 3, "winRate": 72, "base": 3.32, "bonus": 6.07, "symbols": 6, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:5},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?6.07:partial>=Math.ceil(sequence.length*.7)?3.32:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
