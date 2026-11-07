import crypto from "node:crypto";
// Standalone server engine for Ocean Voyage (Game #59); no shared profile resolver.
const GAME={id:59,name:"Ocean Voyage",profile:"crash",variant:"ocean-voyage",rules:{"engineId": "knp-059-ocean-voyage", "title": "Ocean Voyage", "objective": "Ocean Voyage: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 321, "difficulty": 5, "target": 9, "risk": 0.33, "reward": 6.81, "sequenceLength": 4, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 17, "rounds": 3, "difficulty": 2, "winRate": 56, "base": 1.81, "bonus": 7.06, "symbols": 7, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const wave=Array.from({length:3},(_,i)=>({step:i+1,power:crypto.randomInt(1,100)}));
      const threshold=Number(choice.threshold||50),survived=wave.filter(x=>x.power>=threshold).length;
      multiplier=survived>=Math.ceil(wave.length*.75)?7.06:survived>=Math.ceil(wave.length*.5)?1.81:0;
      result={...result,mechanic:"Power wave",wave,threshold,survived};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
