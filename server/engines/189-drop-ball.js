import crypto from "node:crypto";
// Standalone server engine for drop-ball (Game #189); no shared profile resolver.
const GAME={id:189,name:"Drop Ball",profile:"plinko",variant:"drop-ball",rules:{"engineId": "knp-189-drop-ball", "title": "Drop Ball", "objective": "Drop Ball: Ball Drop", "instructions": "Drop a ball through a pegboard into a multiplier slot.", "mechanic": "Ball Drop", "parameters": {"mode": 202, "difficulty": 5, "target": 10, "risk": 0.54, "reward": 5.1, "sequenceLength": 8, "symbolCount": 6}, "uniqueRuleVersion": 1},parameters:{"target": 13, "range": 19, "rounds": 6, "difficulty": 5, "winRate": 49, "base": 3.0, "bonus": 4.5, "symbols": 6, "lanes": 8, "sequence": 5}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,12));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?6.13:pairs?3.08:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:12};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
