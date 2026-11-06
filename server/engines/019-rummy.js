import crypto from "node:crypto";
// Standalone server engine for Rummy (Game #19); no shared profile resolver.
const GAME={id:19,name:"Rummy",profile:"rummy",variant:"rummy",rules:{"engineId": "knp-019-rummy", "title": "Rummy", "objective": "Rummy: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 758, "difficulty": 5, "target": 6, "risk": 0.16, "reward": 6.59, "sequenceLength": 7, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 16, "range": 11, "rounds": 7, "difficulty": 5, "winRate": 39, "base": 1.19, "bonus": 6.84, "symbols": 7, "lanes": 7, "sequence": 7}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const wave=Array.from({length:7},(_,i)=>({step:i+1,power:crypto.randomInt(1,100)}));
      const threshold=Number(choice.threshold||50),survived=wave.filter(x=>x.power>=threshold).length;
      multiplier=survived>=Math.ceil(wave.length*.75)?6.84:survived>=Math.ceil(wave.length*.5)?1.19:0;
      result={...result,mechanic:"Power wave",wave,threshold,survived};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
