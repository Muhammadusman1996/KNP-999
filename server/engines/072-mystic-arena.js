import crypto from "node:crypto";
// Standalone server engine for Mystic Arena (Game #72); no shared profile resolver.
const GAME={id:72,name:"Mystic Arena",profile:"arcade",variant:"mystic-arena",rules:{"engineId": "knp-072-mystic-arena", "title": "Mystic Arena", "objective": "Mystic Arena: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 802, "difficulty": 3, "target": 7, "risk": 0.28, "reward": 4.51, "sequenceLength": 4, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 13, "range": 18, "rounds": 7, "difficulty": 2, "winRate": 51, "base": 3.11, "bonus": 4.76, "symbols": 11, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const spins=Array.from({length:5},()=>crypto.randomInt(1,19));
      const chosen=Number(choice.number||0),matches=spins.filter(v=>v===chosen).length;
      multiplier=matches?Number((3.11*matches).toFixed(2)):0;
      result={...result,mechanic:"Five-draw number hunt",draws:spins,chosen,matches};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
