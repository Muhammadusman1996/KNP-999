import crypto from "node:crypto";
// Standalone server engine for Velvet Quest (Game #40); no shared profile resolver.
const GAME={id:40,name:"Velvet Quest",profile:"arcade",variant:"velvet-quest",rules:{"engineId": "knp-040-velvet-quest", "title": "Velvet Quest", "objective": "Velvet Quest: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 615, "difficulty": 1, "target": 4, "risk": 0.12, "reward": 5.55, "sequenceLength": 3, "symbolCount": 9}, "uniqueRuleVersion": 2},parameters:{"target": 10, "range": 17, "rounds": 3, "difficulty": 1, "winRate": 35, "base": 2.05, "bonus": 5.8, "symbols": 9, "lanes": 3, "sequence": 3}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,9));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?5.8:pairs?2.05:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:9};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
