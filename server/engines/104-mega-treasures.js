import crypto from "node:crypto";
// Standalone server engine for Mega Treasures (Game #104); no shared profile resolver.
const GAME={id:104,name:"Mega Treasures",profile:"arcade",variant:"mega-treasures",rules:{"engineId": "knp-104-mega-treasures", "title": "Mega Treasures", "objective": "Mega Treasures: Symbol Hunt", "instructions": "Choose a symbol before the round; the server draws a symbol set and scores exact matches.", "mechanic": "Symbol Hunt", "parameters": {"mode": 14, "difficulty": 5, "target": 12, "risk": 0.39, "reward": 1.72, "sequenceLength": 5, "symbolCount": 8}, "uniqueRuleVersion": 2},parameters:{"target": 4, "range": 16, "rounds": 6, "difficulty": 3, "winRate": 62, "base": 3.22, "bonus": 1.97, "symbols": 8, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?1.97:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
