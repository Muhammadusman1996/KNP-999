import crypto from "node:crypto";
// Standalone server engine for poker-king (Game #164); no shared profile resolver.
const GAME={id:164,name:"Poker King",profile:"poker",variant:"poker-king",rules:{"engineId": "knp-164-poker-king", "title": "Poker King", "objective": "Poker King: Poker Hand", "instructions": "Deal five cards and evaluate pairs, trips and stronger hands.", "mechanic": "Poker Hand", "parameters": {"mode": 28, "difficulty": 5, "target": 11, "risk": 0.29, "reward": 2.6, "sequenceLength": 8, "symbolCount": 9}, "uniqueRuleVersion": 1},parameters:{"target": 18, "range": 24, "rounds": 5, "difficulty": 5, "winRate": 59, "base": 2.8, "bonus": 2.83, "symbols": 9, "lanes": 8, "sequence": 4}}
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
