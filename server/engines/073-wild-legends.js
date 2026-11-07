import crypto from "node:crypto";
// Standalone server engine for Wild Legends (Game #73); no shared profile resolver.
const GAME={id:73,name:"Wild Legends",profile:"puzzle",variant:"wild-legends",rules:{"engineId": "knp-073-wild-legends", "title": "Wild Legends", "objective": "Wild Legends: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 839, "difficulty": 4, "target": 6, "risk": 0.17, "reward": 7.35, "sequenceLength": 3, "symbolCount": 5}, "uniqueRuleVersion": 2},parameters:{"target": 8, "range": 21, "rounds": 5, "difficulty": 1, "winRate": 40, "base": 1.65, "bonus": 7.6, "symbols": 5, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sequence=Array.from({length:3},()=>crypto.randomInt(0,4));
      const answer=Array.isArray(choice.sequence)?choice.sequence.map(Number):[];
      const exact=answer.length===sequence.length&&answer.every((v,i)=>v===sequence[i]);
      const partial=answer.reduce((n,v,i)=>n+(v===sequence[i]?1:0),0);
      multiplier=exact?7.6:partial>=Math.ceil(sequence.length*.7)?1.65:0;
      result={...result,mechanic:"Echo sequence",sequence,answer,exact,partial};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
