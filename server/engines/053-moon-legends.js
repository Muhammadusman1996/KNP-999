import crypto from "node:crypto";
// Standalone server engine for Moon Legends (Game #53); no shared profile resolver.
const GAME={id:53,name:"Moon Legends",profile:"fishing",variant:"moon-legends",rules:{"engineId": "knp-053-moon-legends", "title": "Moon Legends", "objective": "Moon Legends: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 99, "difficulty": 4, "target": 3, "risk": 0.41, "reward": 3.49, "sequenceLength": 7, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 12, "range": 5, "rounds": 5, "difficulty": 5, "winRate": 64, "base": 3.69, "bonus": 3.74, "symbols": 11, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:7},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?3.74:partial>=Math.ceil(sequence.length*.7)?3.69:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
