import crypto from "node:crypto";
// Standalone server engine for Chicken Road 2.0 (Game #9); no shared profile resolver.
const GAME={id:9,name:"Chicken Road 2.0",profile:"steps",variant:"chicken-road-2-0",rules:{"engineId": "knp-009-chicken-road-2-0", "title": "Chicken Road 2.0", "objective": "Chicken Road 2.0: Risk Ladder", "instructions": "Choose how many stages to attempt; each stage increases reward and failure risk.", "mechanic": "Risk Ladder", "parameters": {"mode": 509, "difficulty": 5, "target": 8, "risk": 0.12, "reward": 7.05, "sequenceLength": 3, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 14, "range": 15, "rounds": 3, "difficulty": 1, "winRate": 35, "base": 2.95, "bonus": 7.3, "symbols": 7, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const wave=Array.from({length:3},(_,i)=>({step:i+1,power:crypto.randomInt(1,100)}));
      const threshold=Number(choice.threshold||50),survived=wave.filter(x=>x.power>=threshold).length;
      multiplier=survived>=Math.ceil(wave.length*.75)?7.3:survived>=Math.ceil(wave.length*.5)?2.95:0;
      result={...result,mechanic:"Power wave",wave,threshold,survived};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
