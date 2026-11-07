import crypto from "node:crypto";
// Standalone server engine for Thunder Voyage (Game #139); no shared profile resolver.
const GAME={id:139,name:"Thunder Voyage",profile:"crash",variant:"thunder-voyage",rules:{"engineId": "knp-139-thunder-voyage", "title": "Thunder Voyage", "objective": "Thunder Voyage: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 312, "difficulty": 5, "target": 8, "risk": 0.29, "reward": 1.87, "sequenceLength": 5, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 12, "range": 15, "rounds": 5, "difficulty": 3, "winRate": 52, "base": 1.77, "bonus": 2.12, "symbols": 9, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const wave=Array.from({length:5},(_,i)=>({step:i+1,power:crypto.randomInt(1,100)}));
      const threshold=Number(choice.threshold||50),survived=wave.filter(x=>x.power>=threshold).length;
      multiplier=survived>=Math.ceil(wave.length*.75)?2.12:survived>=Math.ceil(wave.length*.5)?1.77:0;
      result={...result,mechanic:"Power wave",wave,threshold,survived};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
