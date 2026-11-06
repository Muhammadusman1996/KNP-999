import crypto from "node:crypto";
// Standalone server engine for 777 Fruit Slots (Game #4); no shared profile resolver.
const GAME={id:4,name:"777 Fruit Slots",profile:"slot",variant:"777-fruit-slots",rules:{"engineId": "knp-004-777-fruit-slots", "title": "777 Fruit Slots", "objective": "777 Fruit Slots: Target Trial", "instructions": "Choose a target lane; hits are resolved on the server with game-specific accuracy and reward values.", "mechanic": "Target Trial", "parameters": {"mode": 313, "difficulty": 5, "target": 7, "risk": 0.39, "reward": 1.82, "sequenceLength": 5, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 11, "range": 14, "rounds": 6, "difficulty": 3, "winRate": 62, "base": 2.32, "bonus": 2.07, "symbols": 6, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const sectors=Array.from({length:8},(_,i)=>({sector:i,value:crypto.randomInt(0,100)}));
      const selected=Number(choice.sector??-1),landed=sectors.reduce((a,b)=>a.value>b.value?a:b).sector;
      multiplier=selected===landed?2.07:0;
      result={...result,mechanic:"Peak sector",sectors,selected,landed};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
