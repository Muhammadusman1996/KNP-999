# Issue 1 - Individualized 140-game rules layer

This update adds a per-title gameplay definition to every game:
- Unique engine ID and objective text for each of 140 titles.
- Individual instructions shown in that game's home description.
- Per-game difficulty, target, risk, reward, sequence length and symbol parameters.
- Each server engine returns its own gameplay metadata and resolves an additional server-side challenge using that game's parameters.
- 140/140 engine registry smoke test passed; all 283 JavaScript files passed `node --check`.

Important accuracy note:
The games still use 13 underlying base families (slots, crash, wheel, fishing, dice, puzzle, arcade, card, steps, plinko, blackjack, rummy, poker). This patch makes each title's rules/configuration and server challenge individualized, but does NOT yet create 140 wholly different visual interfaces and entirely independent game-loop implementations. Do not market it as 140 fully unique commercial-grade games yet.
