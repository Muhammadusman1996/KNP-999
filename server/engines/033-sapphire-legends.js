import crypto from "node:crypto";
// Standalone server engine for Sapphire Legends (Game #33); no shared profile resolver.
const GAME={id:33,name:"Sapphire Legends",profile:"puzzle",variant:"sapphire-legends",rules:{"engineId": "knp-033-sapphire-legends", "title": "Sapphire Legends", "objective": "Sapphire Legends: Risk Ladder", "instructions": "Choose how many stages to attempt; each stage increases reward and failure risk.", "mechanic": "Risk Ladder", "parameters": {"mode": 400, "difficulty": 4, "target": 10, "risk": 0.48, "reward": 4.36, "sequenceLength": 4, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 17, "range": 14, "rounds": 6, "difficulty": 2, "winRate": 71, "base": 3.76, "bonus": 4.61, "symbols": 10, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:4},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?4.61:partial>=Math.ceil(sequence.length*.7)?3.76:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
