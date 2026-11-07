import crypto from "node:crypto";
// Standalone server engine for video-poker (Game #173); no shared profile resolver.
const GAME={id:173,name:"Video Poker",profile:"poker",variant:"video-poker",rules:{"engineId": "knp-173-video-poker", "title": "Video Poker", "objective": "Video Poker: Video Poker", "instructions": "Deal five cards, hold your choices and draw replacements for a poker hand.", "mechanic": "Video Poker", "parameters": {"mode": 181, "difficulty": 4, "target": 7, "risk": 0.38, "reward": 3.5, "sequenceLength": 7, "symbolCount": 11}, "uniqueRuleVersion": 1},parameters:{"target": 12, "range": 18, "rounds": 8, "difficulty": 4, "winRate": 68, "base": 2.2, "bonus": 5.83, "symbols": 11, "lanes": 7, "sequence": 5}}
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
