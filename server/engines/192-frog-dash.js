import crypto from "node:crypto";
// Standalone server engine for frog-dash (Game #192); no shared profile resolver.
const GAME={id:192,name:"Frog Dash",profile:"steps",variant:"frog-dash",rules:{"engineId": "knp-192-frog-dash", "title": "Frog Dash", "objective": "Frog Dash: Frog Crossing", "instructions": "Hop across safe platforms and avoid obstacles.", "mechanic": "Frog Crossing", "parameters": {"mode": 2, "difficulty": 3, "target": 13, "risk": 0.57, "reward": 5.4, "sequenceLength": 6, "symbolCount": 9}, "uniqueRuleVersion": 1},parameters:{"target": 16, "range": 22, "rounds": 3, "difficulty": 3, "winRate": 52, "base": 1.2, "bonus": 5.5, "symbols": 9, "lanes": 6, "sequence": 4}}
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
