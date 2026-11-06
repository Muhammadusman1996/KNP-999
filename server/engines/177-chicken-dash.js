import crypto from "node:crypto";
// Standalone server engine for chicken-dash (Game #177); no shared profile resolver.
const GAME={id:177,name:"Chicken Dash",profile:"steps",variant:"chicken-dash",rules:{"engineId": "knp-177-chicken-dash", "title": "Chicken Dash", "objective": "Chicken Dash: Chicken Sprint", "instructions": "Move through a sequence of safe lanes while avoiding hazards.", "mechanic": "Chicken Sprint", "parameters": {"mode": 249, "difficulty": 3, "target": 11, "risk": 0.42, "reward": 3.9, "sequenceLength": 6, "symbolCount": 8}, "uniqueRuleVersion": 1},parameters:{"target": 16, "range": 22, "rounds": 6, "difficulty": 3, "winRate": 37, "base": 3.0, "bonus": 7.17, "symbols": 8, "lanes": 6, "sequence": 5}}
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
