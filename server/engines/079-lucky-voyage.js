import crypto from "node:crypto";
// Standalone server engine for Lucky Voyage (Game #79); no shared profile resolver.
const GAME={id:79,name:"Lucky Voyage",profile:"dice",variant:"lucky-voyage",rules:{"engineId": "knp-079-lucky-voyage", "title": "Lucky Voyage", "objective": "Lucky Voyage: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 64, "difficulty": 5, "target": 11, "risk": 0.53, "reward": 6.36, "sequenceLength": 4, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 19, "range": 8, "rounds": 8, "difficulty": 2, "winRate": 76, "base": 1.56, "bonus": 6.61, "symbols": 6, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const wave=Array.from({length:8},(_,i)=>({step:i+1,power:crypto.randomInt(1,100)}));
      const threshold=Number(choice.threshold||50),survived=wave.filter(x=>x.power>=threshold).length;
      multiplier=survived>=Math.ceil(wave.length*.75)?6.61:survived>=Math.ceil(wave.length*.5)?1.56:0;
      result={...result,mechanic:"Power wave",wave,threshold,survived};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
