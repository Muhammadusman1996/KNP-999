import crypto from "node:crypto";
// Standalone server engine for Mystic Quest (Game #120); no shared profile resolver.
const GAME={id:120,name:"Mystic Quest",profile:"arcade",variant:"mystic-quest",rules:{"engineId": "knp-120-mystic-quest", "title": "Mystic Quest", "objective": "Mystic Quest: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 584, "difficulty": 1, "target": 10, "risk": 0.22, "reward": 4.65, "sequenceLength": 3, "symbolCount": 11}, "uniqueRuleVersion": 2},parameters:{"target": 8, "range": 10, "rounds": 7, "difficulty": 1, "winRate": 45, "base": 1.25, "bonus": 4.9, "symbols": 11, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,11));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?4.9:pairs?1.25:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:11};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
