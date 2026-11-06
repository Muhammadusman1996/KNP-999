import crypto from "node:crypto";
// Standalone server engine for Fortune Ox (Game #3); no shared profile resolver.
const GAME={id:3,name:"Fortune Ox",profile:"slot",variant:"fortune-ox",rules:{"engineId": "knp-003-fortune-ox", "title": "Fortune Ox", "objective": "Fortune Ox: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 221, "difficulty": 4, "target": 6, "risk": 0.36, "reward": 1.29, "sequenceLength": 7, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 15, "range": 13, "rounds": 3, "difficulty": 5, "winRate": 59, "base": 1.39, "bonus": 1.54, "symbols": 9, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:7},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?1.54:partial>=Math.ceil(sequence.length*.7)?1.39:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
