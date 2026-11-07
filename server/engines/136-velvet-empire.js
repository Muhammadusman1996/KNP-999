import crypto from "node:crypto";
// Standalone server engine for Velvet Empire (Game #136); no shared profile resolver.
const GAME={id:136,name:"Velvet Empire",profile:"arcade",variant:"velvet-empire",rules:{"engineId": "knp-136-velvet-empire", "title": "Velvet Empire", "objective": "Velvet Empire: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 190, "difficulty": 2, "target": 11, "risk": 0.29, "reward": 6.67, "sequenceLength": 5, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 12, "range": 21, "rounds": 5, "difficulty": 3, "winRate": 52, "base": 2.67, "bonus": 6.92, "symbols": 11, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const samples=Array.from({length:4},()=>crypto.randomInt(0,22));
      const target=Number(choice.target??12);
      const distance=Math.abs(samples.reduce((a,b)=>a+b,0)-target);
      multiplier=distance===0?6.92:distance<=2?2.67:0;
      result={...result,mechanic:"Sum precision",samples,target,distance,total:samples.reduce((a,b)=>a+b,0)};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
