import crypto from "node:crypto";
// Standalone server engine for Pearl Legends (Game #133); no shared profile resolver.
const GAME={id:133,name:"Pearl Legends",profile:"fishing",variant:"pearl-legends",rules:{"engineId": "knp-133-pearl-legends", "title": "Pearl Legends", "objective": "Pearl Legends: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 79, "difficulty": 4, "target": 5, "risk": 0.52, "reward": 5.4, "sequenceLength": 3, "symbolCount": 8}, "uniqueRuleVersion": 2},parameters:{"target": 18, "range": 18, "rounds": 4, "difficulty": 1, "winRate": 75, "base": 2.9, "bonus": 5.65, "symbols": 8, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:3},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?5.65:partial>=Math.ceil(sequence.length*.7)?2.9:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
