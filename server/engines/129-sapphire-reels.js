import crypto from "node:crypto";
// Standalone server engine for Sapphire Reels (Game #129); no shared profile resolver.
const GAME={id:129,name:"Sapphire Reels",profile:"puzzle",variant:"sapphire-reels",rules:{"engineId": "knp-129-sapphire-reels", "title": "Sapphire Reels", "objective": "Sapphire Reels: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 939, "difficulty": 5, "target": 4, "risk": 0.39, "reward": 4.27, "sequenceLength": 5, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 12, "range": 18, "rounds": 3, "difficulty": 3, "winRate": 62, "base": 1.87, "bonus": 4.52, "symbols": 11, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const wave=Array.from({length:3},(_,i)=>({step:i+1,power:crypto.randomInt(1,100)}));
      const threshold=Number(choice.threshold||50),survived=wave.filter(x=>x.power>=threshold).length;
      multiplier=survived>=Math.ceil(wave.length*.75)?4.52:survived>=Math.ceil(wave.length*.5)?1.87:0;
      result={...result,mechanic:"Power wave",wave,threshold,survived};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
