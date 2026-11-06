import crypto from "node:crypto";
// Standalone server engine for chicken-dash-10000 (Game #194); no shared profile resolver.
const GAME={id:194,name:"Chicken Dash 10000",profile:"steps",variant:"chicken-dash-10000",rules:{"engineId": "knp-194-chicken-dash-10000", "title": "Chicken Dash 10000", "objective": "Chicken Dash 10000: Long Chicken Run", "instructions": "Advance through a longer lane course with increasing risk.", "mechanic": "Long Chicken Run", "parameters": {"mode": 36, "difficulty": 5, "target": 15, "risk": 0.59, "reward": 5.6, "sequenceLength": 8, "symbolCount": 11}, "uniqueRuleVersion": 1},parameters:{"target": 18, "range": 24, "rounds": 5, "difficulty": 5, "winRate": 54, "base": 1.6, "bonus": 6.17, "symbols": 11, "lanes": 8, "sequence": 6}}
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
