# Individual Engine Split - KNP-999

Completed in this build:
- Replaced the shared 13-profile server resolver with 140 standalone server engine modules.
- Every game engine file now contains its own resolver implementation and title-specific mechanics/parameters.
- Removed the old shared server/engines/core.js resolver; the registry imports the 140 standalone modules.
- Runtime smoke test: 140/140 server engines successfully resolved a round.
- Syntax validation: all 285 JavaScript files passed node --check.

Remaining limitation:
- The browser-side game screens in src/engines still use shared profile-based setup/rendering branches for parts of the interactive gameplay. This update separates the authoritative server game logic, but does not yet create 140 completely distinct front-end game screens, animations, and control systems.
- Full Vite production build and full browser testing were not run because this environment does not have project dependencies installed.
- Virtual coins only. Do not treat this as proof of production readiness.
