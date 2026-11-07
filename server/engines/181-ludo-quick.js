import crypto from "node:crypto";
// Standalone server engine for ludo-quick (Game #181); no shared profile resolver.
const GAME={id:181,name:"Ludo Quick",profile:"arcade",variant:"ludo-quick",rules:{"engineId": "knp-181-ludo-quick", "title": "Ludo Quick", "objective": "Ludo Quick: Quick Ludo", "instructions": "Race a token around a compact virtual ludo board.", "mechanic": "Quick Ludo", "parameters": {"mode": 66, "difficulty": 2, "target": 15, "risk": 0.46, "reward": 4.3, "sequenceLength": 5, "symbolCount": 12}, "uniqueRuleVersion": 1},parameters:{"target": 5, "range": 11, "rounds": 4, "difficulty": 2, "winRate": 41, "base": 1.4, "bonus": 1.83, "symbols": 12, "lanes": 5, "sequence": 5}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?3.74:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
