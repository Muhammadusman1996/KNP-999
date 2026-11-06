import crypto from "node:crypto";
// Standalone server engine for Wild Bounty Showdown (Game #13); no shared profile resolver.
const GAME={id:13,name:"Wild Bounty Showdown",profile:"slot",variant:"wild-bounty-showdown",rules:{"engineId": "knp-013-wild-bounty-showdown", "title": "Wild Bounty Showdown", "objective": "Wild Bounty Showdown: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 701, "difficulty": 4, "target": 3, "risk": 0.33, "reward": 4.86, "sequenceLength": 4, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 15, "range": 23, "rounds": 6, "difficulty": 2, "winRate": 56, "base": 1.36, "bonus": 5.11, "symbols": 6, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:4},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?5.11:partial>=Math.ceil(sequence.length*.7)?1.36:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
