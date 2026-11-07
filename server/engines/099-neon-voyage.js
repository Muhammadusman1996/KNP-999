import crypto from "node:crypto";
// Standalone server engine for Neon Voyage (Game #99); no shared profile resolver.
const GAME={id:99,name:"Neon Voyage",profile:"crash",variant:"neon-voyage",rules:{"engineId": "knp-099-neon-voyage", "title": "Neon Voyage", "objective": "Neon Voyage: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 793, "difficulty": 5, "target": 10, "risk": 0.13, "reward": 6.16, "sequenceLength": 4, "symbolCount": 10}, "uniqueRuleVersion": 2},parameters:{"target": 16, "range": 7, "rounds": 4, "difficulty": 2, "winRate": 36, "base": 2.96, "bonus": 6.41, "symbols": 10, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const wave=Array.from({length:4},(_,i)=>({step:i+1,power:crypto.randomInt(1,100)}));
      const threshold=Number(choice.threshold||50),survived=wave.filter(x=>x.power>=threshold).length;
      multiplier=survived>=Math.ceil(wave.length*.75)?6.41:survived>=Math.ceil(wave.length*.5)?2.96:0;
      result={...result,mechanic:"Power wave",wave,threshold,survived};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
