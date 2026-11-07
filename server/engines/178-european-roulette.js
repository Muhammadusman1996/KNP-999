import crypto from "node:crypto";

// European Roulette (single-zero wheel). All outcomes are generated server-side.
const GAME = {
  id: 178,
  name: "European Roulette",
  profile: "wheel",
  variant: "european-roulette",
  rules: {
    engineId: "knp-178-european-roulette",
    title: "European Roulette",
    objective: "Place virtual chips on a European single-zero roulette layout."
  }
};

const WHEEL = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const colorOf = n => n === 0 ? "green" : RED.has(n) ? "red" : "black";

function wins(bet, number, color) {
  const { type, value } = bet;
  if (type === "number") return number === Number(value);
  if (type === "color") return color === value;
  if (type === "parity") return number !== 0 && (value === "odd" ? number % 2 === 1 : number % 2 === 0);
  if (type === "range") return number !== 0 && (value === "low" ? number >= 1 && number <= 18 : number >= 19 && number <= 36);
  if (type === "dozen") {
    const d = Number(value);
    return number !== 0 && number >= (d - 1) * 12 + 1 && number <= d * 12;
  }
  if (type === "column") {
    const c = Number(value);
    return number !== 0 && number % 3 === c % 3;
  }
  if (type === "split" || type === "street" || type === "corner" || type === "sixline") {
    const nums = Array.isArray(value) ? value.map(Number) : String(value).split("-").map(Number);
    return nums.includes(number);
  }
  return false;
}

function payoutMultiplier(type) {
  return ({ number: 36, color: 2, parity: 2, range: 2, dozen: 3, column: 3, split: 18, street: 12, corner: 9, sixline: 6 })[type] || 0;
}

function resolve({ stake, choice = {}, action = "play" }) {
  const totalStake = Number(stake);
  if (!Number.isFinite(totalStake) || totalStake <= 0) throw new Error("Invalid stake");
  const bets = Array.isArray(choice.bets) ? choice.bets : [];
  if (!bets.length) throw new Error("Place at least one roulette bet");
  const normalized = bets.map(b => ({
    type: String(b.type || ""),
    value: b.value,
    amount: Number(b.amount)
  }));
  if (normalized.some(b =>
    !["number","color","parity","range","dozen","column","split","street","corner","sixline"].includes(b.type) ||
    !Number.isFinite(b.amount) || b.amount <= 0 ||
    (b.type === "number" && (!Number.isInteger(Number(b.value)) || Number(b.value) < 0 || Number(b.value) > 36)) ||
    (b.type === "color" && !["red","black"].includes(b.value)) ||
    (b.type === "parity" && !["odd","even"].includes(b.value)) ||
    (b.type === "range" && !["low","high"].includes(b.value)) ||
    (b.type === "dozen" && ![1,2,3].includes(Number(b.value))) ||
    (b.type === "column" && ![1,2,3].includes(Number(b.value))) ||
    (["split","street","corner","sixline"].includes(b.type) && (() => {
      const nums = Array.isArray(b.value) ? b.value.map(Number) : String(b.value).split("-").map(Number);
      const required = {split:2,street:3,corner:4,sixline:6}[b.type];
      return nums.length !== required || nums.some(n => !Number.isInteger(n) || n < 0 || n > 36) || new Set(nums).size !== required;
    })())
  )) throw new Error("Invalid roulette bet");
  const placedStake = normalized.reduce((sum, b) => sum + b.amount, 0);
  if (Math.abs(placedStake - totalStake) > 0.001) throw new Error("Roulette bet total does not match stake");

  const wheelIndex = crypto.randomInt(0, WHEEL.length);
  const winningNumber = WHEEL[wheelIndex];
  const winningColor = colorOf(winningNumber);
  const winsList = normalized.filter(b => wins(b, winningNumber, winningColor)).map(b => ({
    ...b,
    multiplier: payoutMultiplier(b.type),
    payout: Math.round(b.amount * payoutMultiplier(b.type) * 100) / 100
  }));
  const payout = Math.round(winsList.reduce((sum, b) => sum + b.payout, 0) * 100) / 100;
  const result = {
    gameId: GAME.id,
    name: GAME.name,
    profile: GAME.profile,
    variant: GAME.variant,
    action,
    wheel: WHEEL,
    wheelIndex,
    winningNumber,
    winningColor,
    bets: normalized,
    winningBets: winsList,
    won: payout > 0,
    stake: totalStake,
    payout,
    net: Math.round((payout - totalStake) * 100) / 100,
    summary: `${winningNumber} ${winningColor.toUpperCase()}`
  };
  return { multiplier: totalStake ? payout / totalStake : 0, payout, result };
}

export const engine = Object.freeze({ gameId: GAME.id, name: GAME.name, profile: GAME.profile, variant: GAME.variant, resolve });
export default engine;
