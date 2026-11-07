import crypto from "node:crypto";
// Standalone server engine for birds-beasts (Game #142); no shared profile resolver.
const GAME={id:142,name:"Birds & Beasts",profile:"arcade",variant:"birds-beasts",rules:{"engineId": "knp-142-birds-beasts", "title": "Birds & Beasts", "objective": "Birds & Beasts: Wildlife Match", "instructions": "Choose a creature; a server-generated wildlife draw checks your selection.", "mechanic": "Wildlife Match", "parameters": {"mode": 156, "difficulty": 3, "target": 15, "risk": 0.47, "reward": 5.4, "sequenceLength": 6, "symbolCount": 8}, "uniqueRuleVersion": 1},parameters:{"target": 11, "range": 17, "rounds": 7, "difficulty": 3, "winRate": 37, "base": 3.2, "bonus": 2.17, "symbols": 8, "lanes": 6, "sequence": 6}}
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
