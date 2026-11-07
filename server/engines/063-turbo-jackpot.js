import crypto from "node:crypto";
// Standalone server engine for Turbo Jackpot (Game #63); no shared profile resolver.
const GAME={id:63,name:"Turbo Jackpot",profile:"dice",variant:"turbo-jackpot",rules:{"engineId": "knp-063-turbo-jackpot", "title": "Turbo Jackpot", "objective": "Turbo Jackpot: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 480, "difficulty": 4, "target": 3, "risk": 0.25, "reward": 3.38, "sequenceLength": 6, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 14, "range": 20, "rounds": 4, "difficulty": 4, "winRate": 48, "base": 1.28, "bonus": 3.63, "symbols": 10, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:6},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?3.63:partial>=Math.ceil(sequence.length*.7)?1.28:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
