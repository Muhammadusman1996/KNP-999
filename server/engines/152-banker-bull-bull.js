import crypto from "node:crypto";
// Standalone server engine for banker-bull-bull (Game #152); no shared profile resolver.
const GAME={id:152,name:"Banker Bull Bull",profile:"poker",variant:"banker-bull-bull",rules:{"engineId": "knp-152-banker-bull-bull", "title": "Banker Bull Bull", "objective": "Banker Bull Bull: Banker Hand", "instructions": "Create a five-card combination and check its bull-hand value.", "mechanic": "Banker Hand", "parameters": {"mode": 75, "difficulty": 3, "target": 12, "risk": 0.57, "reward": 1.4, "sequenceLength": 6, "symbolCount": 11}, "uniqueRuleVersion": 1},parameters:{"target": 6, "range": 12, "rounds": 5, "difficulty": 3, "winRate": 47, "base": 2.8, "bonus": 5.5, "symbols": 11, "lanes": 6, "sequence": 4}}
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
