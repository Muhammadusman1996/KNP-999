import crypto from "node:crypto";

/**
 * Server-only NexusGGR client.
 * Credentials are read from environment variables and must never reach the browser.
 */
export class NexusGGRClient {
  constructor(env = process.env) {
    this.endpoint = env.NEXUSGGR_ENDPOINT || "https://api.nexusggr.com";
    this.agentCode = env.NEXUSGGR_AGENT_CODE || "";
    this.agentToken = env.NEXUSGGR_AGENT_TOKEN || "";
    this.timeoutMs = Number(env.NEXUSGGR_TIMEOUT_MS || 15000);
    this.lastCallAt = new Map();
  }

  configured() {
    return Boolean(this.agentCode && this.agentToken);
  }

  enforceRateLimit(method, fields = {}) {
    const interval = method === "user_withdraw_reset" && fields.all_users === true ? 60000
      : method === "get_game_log" ? 60000
      : method === "game_list" || method === "provider_list" ? 1000
      : method === "agent_statistics" ? 5000 : 0;
    if (!interval) return;
    const now = Date.now();
    const previous = this.lastCallAt.get(method) || 0;
    const remaining = interval - (now - previous);
    if (remaining > 0) {
      const error = new Error(`Rate limit: retry in ${Math.ceil(remaining / 1000)} second(s).`);
      error.statusCode = 429;
      throw error;
    }
    this.lastCallAt.set(method, now);
  }

  async call(method, fields = {}) {
    if (!this.configured()) {
      const error = new Error("NexusGGR credentials are not configured on the server.");
      error.statusCode = 503;
      throw error;
    }
    if (!/^[a-z_]+$/.test(method)) throw new Error("Invalid NexusGGR method.");
    this.enforceRateLimit(method, fields);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...fields,
          method,
          agent_code: this.agentCode,
          agent_token: this.agentToken
        }),
        signal: controller.signal
      });
      const raw = await response.text();
      let data;
      try { data = raw ? JSON.parse(raw) : {}; }
      catch { throw new Error(`NexusGGR returned invalid JSON (HTTP ${response.status}).`); }
      if (!response.ok) {
        const error = new Error(data.msg || `NexusGGR HTTP ${response.status}`);
        error.statusCode = response.status;
        error.providerResponse = data;
        throw error;
      }
      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  // Provider and game catalogue
  providerList(fields = {}) { return this.call("provider_list", fields); }
  gameList(fields = {}) { return this.call("game_list", fields); }
  gameListV2(fields = {}) { return this.call("game_list_v2", fields); }
  gameLaunch(fields = {}) { return this.call("game_launch", fields); }
  getGameLog(fields = {}) { return this.call("get_game_log", fields); }
  getGameHistory(fields = {}) { return this.call("get_game_history", fields); }
  playerList(fields = {}) { return this.call("player_list", fields); }

  // Agent / player information
  moneyInfo(fields = {}) { return this.call("money_info", fields); }
  agentInfo(fields = {}) { return this.call("agent", fields); }
  userInfo(fields = {}) { return this.call("user", fields); }
  allUsers(fields = {}) { return this.call("all_users", fields); }
  agentStatistics(fields = {}) { return this.call("agent_statistics", fields); }

  // Transfer methods are intentionally NOT exposed through customer routes.
  userDeposit(fields = {}) { return this.call("user_deposit", fields); }
  userWithdraw(fields = {}) { return this.call("user_withdraw", fields); }
  userWithdrawReset(fields = {}) { return this.call("user_withdraw_reset", fields); }
  transferStatus(fields = {}) { return this.call("transfer_status", fields); }

  // RTP controls
  controlUsersRtp(fields = {}) { return this.call("control_users_rtp", fields); }
  controlRtp(fields = {}) { return this.call("control_rtp", fields); }

  // Bonus
  bonusCreate(fields = {}) { return this.call("bonus_create", fields); }
  bonusCancel(fields = {}) { return this.call("bonus_cancel", fields); }
  bonusHistory(fields = {}) { return this.call("bonus_history", fields); }

  // Seamless API
  userBalance(fields = {}) { return this.call("user_balance", fields); }
  transaction(fields = {}) { return this.call("transaction", fields); }

  // FreeSpin Tour
  tourCreate(fields = {}) { return this.call("tour_create", fields); }
  tourCancel(fields = {}) { return this.call("tour_cancel", fields); }
  tourHistory(fields = {}) { return this.call("tour_history", fields); }
}

export const nexusMethods = Object.freeze([
  "provider_list", "game_list", "game_list_v2", "game_launch",
  "money_info", "agent", "user", "all_users", "agent_statistics",
  "user_deposit", "user_withdraw", "user_withdraw_reset", "transfer_status",
  "player_list", "get_game_log", "get_game_history",
  "control_users_rtp", "control_rtp",
  "bonus_create", "bonus_cancel", "bonus_history",
  "user_balance", "transaction",
  "tour_create", "tour_cancel", "tour_history"
]);

// Generate a unique id for idempotent transfer calls if the operator later enables them.
export function makeAgentSign() {
  return crypto.randomUUID().replaceAll("-", "");
}
