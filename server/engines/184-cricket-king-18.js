import crypto from "node:crypto";
// Standalone server engine for cricket-king-18 (Game #184); no shared profile resolver.
const GAME={id:184,name:"Cricket King 18",profile:"arcade",variant:"cricket-king-18",rules:{"engineId": "knp-184-cricket-king-18", "title": "Cricket King 18", "objective": "Cricket King 18: Cricket King", "instructions": "Play a quick batting challenge and chase the target score.", "mechanic": "Cricket King", "parameters": {"mode": 117, "difficulty": 5, "target": 5, "risk": 0.49, "reward": 4.6, "sequenceLength": 8, "symbolCount": 8}, "uniqueRuleVersion": 1},parameters:{"target": 8, "range": 14, "rounds": 7, "difficulty": 5, "winRate": 44, "base": 2.0, "bonus": 2.83, "symbols": 8, "lanes": 8, "sequence": 4}}
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
