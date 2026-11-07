import crypto from "node:crypto";
// Standalone server engine for bull-bull-100 (Game #149); no shared profile resolver.
const GAME={id:149,name:"Bull Bull 100",profile:"poker",variant:"bull-bull-100",rules:{"engineId": "knp-149-bull-bull-100", "title": "Bull Bull 100", "objective": "Bull Bull 100: Bull Hand", "instructions": "Build a five-card hand and compare its rank using the server result.", "mechanic": "Bull Hand", "parameters": {"mode": 24, "difficulty": 5, "target": 9, "risk": 0.54, "reward": 6.1, "sequenceLength": 8, "symbolCount": 8}, "uniqueRuleVersion": 1},parameters:{"target": 18, "range": 24, "rounds": 8, "difficulty": 5, "winRate": 44, "base": 2.2, "bonus": 4.5, "symbols": 8, "lanes": 8, "sequence": 5}}
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
