import crypto from "node:crypto";
// Standalone server engine for Poker (Game #20); no shared profile resolver.
const GAME={id:20,name:"Poker",profile:"poker",variant:"poker",rules:{"engineId": "knp-020-poker", "title": "Poker", "objective": "Poker: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 795, "difficulty": 1, "target": 3, "risk": 0.23, "reward": 2.86, "sequenceLength": 4, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 7, "range": 5, "rounds": 8, "difficulty": 2, "winRate": 46, "base": 3.06, "bonus": 3.11, "symbols": 12, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,12));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?3.11:pairs?3.06:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:12};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
