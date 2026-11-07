import crypto from "node:crypto";
// Standalone server engine for Mega Empire (Game #56); no shared profile resolver.
const GAME={id:56,name:"Mega Empire",profile:"arcade",variant:"mega-empire",rules:{"engineId": "knp-056-mega-empire", "title": "Mega Empire", "objective": "Mega Empire: Treasure Route", "instructions": "Choose a route and risk level; the server resolves route hazards and treasure value.", "mechanic": "Treasure Route", "parameters": {"mode": 199, "difficulty": 2, "target": 12, "risk": 0.22, "reward": 7.1, "sequenceLength": 3, "symbolCount": 6}, "uniqueRuleVersion": 2},parameters:{"target": 19, "range": 17, "rounds": 4, "difficulty": 1, "winRate": 45, "base": 2.6, "bonus": 7.35, "symbols": 6, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,18));
      const target=Number(choice.target??19);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?7.35:distance<=2?2.6:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
