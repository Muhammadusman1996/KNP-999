import crypto from "node:crypto";
// Standalone server engine for mercedes-bmw (Game #144); no shared profile resolver.
const GAME={id:144,name:"Mercedes & BMW",profile:"card",variant:"mercedes-bmw",rules:{"engineId": "knp-144-mercedes-bmw", "title": "Mercedes & BMW", "objective": "Mercedes & BMW: Rival Brands", "instructions": "Pick one of two rival symbols; a server-side draw determines the round result.", "mechanic": "Rival Brands", "parameters": {"mode": 190, "difficulty": 5, "target": 4, "risk": 0.49, "reward": 5.6, "sequenceLength": 8, "symbolCount": 10}, "uniqueRuleVersion": 1},parameters:{"target": 13, "range": 19, "rounds": 3, "difficulty": 5, "winRate": 39, "base": 1.2, "bonus": 2.83, "symbols": 10, "lanes": 8, "sequence": 4}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,22));
      const target=Number(choice.target??5);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?3.41:distance<=2?2.16:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
