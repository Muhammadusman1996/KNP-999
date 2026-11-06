import crypto from "node:crypto";
// Standalone server engine for gallina-fortunata (Game #190); no shared profile resolver.
const GAME={id:190,name:"Gallina Fortunata",profile:"steps",variant:"gallina-fortunata",rules:{"engineId": "knp-190-gallina-fortunata", "title": "Gallina Fortunata", "objective": "Gallina Fortunata: Lucky Hen", "instructions": "Guide the hen along safe steps and stop before a hazard.", "mechanic": "Lucky Hen", "parameters": {"mode": 219, "difficulty": 1, "target": 11, "risk": 0.55, "reward": 5.2, "sequenceLength": 4, "symbolCount": 7}, "uniqueRuleVersion": 1},parameters:{"target": 14, "range": 20, "rounds": 7, "difficulty": 1, "winRate": 50, "base": 3.2, "bonus": 4.83, "symbols": 7, "lanes": 4, "sequence": 6}}
function resolve({stake,choice={},action="play"}){
 const bet=Number(stake); if(!Number.isFinite(bet)||bet<=0)throw new Error("Invalid stake");
 let multiplier=0; let result={gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,action,engineId:GAME.rules.engineId,objective:GAME.rules.objective};
 const wave=Array.from({length:3},(_,i)=>({step:i+1,power:crypto.randomInt(1,100)}));
      const threshold=Number(choice.threshold||50),survived=wave.filter(x=>x.power>=threshold).length;
      multiplier=survived>=Math.ceil(wave.length*.75)?7.3:survived>=Math.ceil(wave.length*.5)?2.95:0;
      result={...result,mechanic:"Power wave",wave,threshold,survived};
 const payout=Math.round(bet*multiplier*100)/100;
 return {multiplier,payout,result:{...result,won:payout>0,stake:bet,payout}};
}
export const engine=Object.freeze({gameId:GAME.id,name:GAME.name,profile:GAME.profile,variant:GAME.variant,resolve});
export default engine;
