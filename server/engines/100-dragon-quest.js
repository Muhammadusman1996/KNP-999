import crypto from "node:crypto";
// Standalone server engine for Dragon Quest (Game #100); no shared profile resolver.
const GAME={id:100,name:"Dragon Quest",profile:"wheel",variant:"dragon-quest",rules:{"engineId": "knp-100-dragon-quest", "title": "Dragon Quest", "objective": "Dragon Quest: Precision Challenge", "instructions": "Choose a target value; the server generates a challenge value and scores distance from target.", "mechanic": "Precision Challenge", "parameters": {"mode": 841, "difficulty": 1, "target": 10, "risk": 0.28, "reward": 3.36, "sequenceLength": 4, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 11, "range": 13, "rounds": 4, "difficulty": 2, "winRate": 51, "base": 2.66, "bonus": 3.61, "symbols": 12, "lanes": 4, "sequence": 4}};
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const reels=Array.from({length:3},()=>crypto.randomInt(0,12));
      const freq=reels.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
      const pairs=Object.values(freq).filter(x=>x===2).length, triple=Object.values(freq).includes(3);
      multiplier=triple?3.61:pairs?2.66:0;
      result={...result,mechanic:"Reel constellation",reels,matched:triple?3:pairs?2:0,symbolPool:12};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
