import crypto from "node:crypto";
// Standalone server engine for Cosmic Adventure (Game #66); no shared profile resolver.
const GAME={id:66,name:"Cosmic Adventure",profile:"card",variant:"cosmic-adventure",rules:{"engineId": "knp-066-cosmic-adventure", "title": "Cosmic Adventure", "objective": "Cosmic Adventure: Risk Ladder", "instructions": "Choose how many stages to attempt; each stage increases reward and failure risk.", "mechanic": "Risk Ladder", "parameters": {"mode": 624, "difficulty": 2, "target": 6, "risk": 0.39, "reward": 7.62, "sequenceLength": 5, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 9, "range": 14, "rounds": 6, "difficulty": 3, "winRate": 62, "base": 3.22, "bonus": 7.87, "symbols": 6, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,15));
      const target=Number(choice.target??9);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?7.87:distance<=2?3.22:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
