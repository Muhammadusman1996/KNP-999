import crypto from "node:crypto";
// Standalone server engine for Ruby Voyage (Game #119); no shared profile resolver.
const GAME={id:119,name:"Ruby Voyage",profile:"dice",variant:"ruby-voyage",rules:{"engineId": "knp-119-ruby-voyage", "title": "Ruby Voyage", "objective": "Ruby Voyage: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 536, "difficulty": 5, "target": 8, "risk": 0.3, "reward": 1.48, "sequenceLength": 6, "symbolCount": 8}, "uniqueRuleVersion": 2},parameters:{"target": 7, "range": 22, "rounds": 6, "difficulty": 4, "winRate": 53, "base": 1.78, "bonus": 1.73, "symbols": 8, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const wave=Array.from({length:6},(_,i)=>({step:i+1,power:crypto.randomInt(1,100)}));
      const threshold=Number(choice.threshold||50),survived=wave.filter(x=>x.power>=threshold).length;
      multiplier=survived>=Math.ceil(wave.length*.75)?1.73:survived>=Math.ceil(wave.length*.5)?1.78:0;
      result={...result,mechanic:"Power wave",wave,threshold,survived};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
