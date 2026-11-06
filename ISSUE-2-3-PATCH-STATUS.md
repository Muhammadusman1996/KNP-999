KNP-999 ISSUE 2 + ISSUE 3 PATCH

Implemented:
- Every game-specific server engine carries its own title ID, objective, mechanic, instructions and per-title difficulty/target/risk/reward parameters.
- Server round result includes the title-specific challenge result.
- All 140 front-end game modules now render the completed round from the server response (server payout, multiplier, challenge status and result details), rather than displaying the locally generated payout as authoritative.
- Wallet balance is refreshed from the server response.
- Added a shared but theme-aware authoritative result panel for all 140 games.
- Syntax validation passed for all 283 JS modules.
- Runtime smoke test passed for all 140 server engine registrations and resolve calls.

Important limitation:
The 140 games still reuse 13 base gameplay families and some pre-result animations/actions remain family-based. This patch individualizes each title's server challenge and synchronizes the final result display, but it does not yet mean 140 wholly independent commercial-grade game loops/visual systems. Production Vite build and full browser testing were not run because dependencies are not installed in this environment.
