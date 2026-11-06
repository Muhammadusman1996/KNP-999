import crypto from "node:crypto";
// Standalone server engine for Velvet Arena (Game #112); no shared profile resolver.
const GAME={id:112,name:"Velvet Arena",profile:"arcade",variant:"velvet-arena",rules:{"engineId": "knp-112-velvet-arena", "title": "Velvet Arena", "objective": "Velvet Arena: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 288, "difficulty": 3, "target": 2, "risk": 0.44, "reward": 3.82, "sequenceLength": 5, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 3, "range": 5, "rounds": 8, "difficulty": 3, "winRate": 67, "base": 3.72, "bonus": 4.07, "symbols": 12, "lanes": 5, "sequence": 5}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,6));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((3.72*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
