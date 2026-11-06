import specs from "../data/game-specs.json";
import { runEngine } from "./runtime.js";
const gameSpec = specs.find(item => item.gameId === 87);
export default function start(root, wallet) {
  return runEngine(root, gameSpec, wallet);
}
