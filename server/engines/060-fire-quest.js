import crypto from "node:crypto";
// Standalone server engine for Fire Quest (Game #60); no shared profile resolver.
const GAME={id:60,name:"Fire Quest",profile:"wheel",variant:"fire-quest",rules:{"engineId": "knp-060-fire-quest", "title": "Fire Quest", "objective": "Fire Quest: Lucky Draw", "instructions": "Choose a number band; a server-generated draw decides whether the selection wins.", "mechanic": "Lucky Draw", "parameters": {"mode": 336, "difficulty": 1, "target": 5, "risk": 0.3, "reward": 3.43, "sequenceLength": 6, "symbolCount": 7}, "uniqueRuleVersion": 2},parameters:{"target": 12, "range": 14, "rounds": 3, "difficulty": 4, "winRate": 53, "base": 2.23, "bonus": 3.68, "symbols": 7, "lanes": 6, "sequence": 6}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,7));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?3.68:pairs?2.23:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:7};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
