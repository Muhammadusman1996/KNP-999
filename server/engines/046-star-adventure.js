import crypto from "node:crypto";
// Standalone server engine for Star Adventure (Game #46); no shared profile resolver.
const GAME={id:46,name:"Star Adventure",profile:"slot",variant:"star-adventure",rules:{"engineId": "knp-046-star-adventure", "title": "Star Adventure", "objective": "Star Adventure: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 859, "difficulty": 2, "target": 11, "risk": 0.17, "reward": 4.95, "sequenceLength": 3, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 4, "range": 14, "rounds": 5, "difficulty": 1, "winRate": 40, "base": 2.55, "bonus": 5.2, "symbols": 7, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,15));
      const target=Number(choice.target??4);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?5.2:distance<=2?2.55:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
