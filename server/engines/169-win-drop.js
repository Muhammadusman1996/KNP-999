import crypto from "node:crypto";
// Standalone server engine for win-drop (Game #169); no shared profile resolver.
const GAME={id:169,name:"Win Drop",profile:"plinko",variant:"win-drop",rules:{"engineId": "knp-169-win-drop", "title": "Win Drop", "objective": "Win Drop: Prize Drop", "instructions": "Drop a token through pegs and land in a multiplier bin.", "mechanic": "Prize Drop", "parameters": {"mode": 113, "difficulty": 5, "target": 3, "risk": 0.34, "reward": 3.1, "sequenceLength": 8, "symbolCount": 7}, "uniqueRuleVersion": 1},parameters:{"target": 8, "range": 14, "rounds": 4, "difficulty": 5, "winRate": 64, "base": 1.4, "bonus": 4.5, "symbols": 7, "lanes": 8, "sequence": 5}}
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
