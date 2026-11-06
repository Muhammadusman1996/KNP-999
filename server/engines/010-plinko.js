import crypto from "node:crypto";
// Standalone server engine for Plinko (Game #10); no shared profile resolver.
const GAME={id:10,name:"Plinko",profile:"plinko",variant:"plinko",rules:{"engineId": "knp-010-plinko", "title": "Plinko", "objective": "Plinko: Combo Quest", "instructions": "Choose a combo type; the server generates a sequence and checks the selected pattern.", "mechanic": "Combo Quest", "parameters": {"mode": 436, "difficulty": 1, "target": 12, "risk": 0.25, "reward": 5.88, "sequenceLength": 6, "symbolCount": 12}, "uniqueRuleVersion": 2},parameters:{"target": 13, "range": 21, "rounds": 4, "difficulty": 4, "winRate": 48, "base": 3.08, "bonus": 6.13, "symbols": 12, "lanes": 6, "sequence": 6}};
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
