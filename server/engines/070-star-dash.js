import crypto from "node:crypto";
// Standalone server engine for Star Dash (Game #70); no shared profile resolver.
const GAME={id:70,name:"Star Dash",profile:"slot",variant:"star-dash",rules:{"engineId": "knp-070-star-dash", "title": "Star Dash", "objective": "Star Dash: Risk Ladder", "instructions": "Choose how many stages to attempt; each stage increases reward and failure risk.", "mechanic": "Risk Ladder", "parameters": {"mode": 695, "difficulty": 1, "target": 5, "risk": 0.15, "reward": 2.28, "sequenceLength": 6, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 7, "range": 22, "rounds": 6, "difficulty": 4, "winRate": 38, "base": 2.08, "bonus": 2.53, "symbols": 12, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,12));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?2.53:pairs?2.08:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:12};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
