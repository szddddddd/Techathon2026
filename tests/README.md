# Tests

Run commands from the repository root after installing dependencies with `npm ci`.

```sh
npm run test:ci
```

The CI baseline covers social and discovery stores, pet state, inbox and platform contacts, Mod behavior, Rodin configuration boundaries, static serving, transforms, placement caching, and scene loading. It uses generated fixtures, simulated providers, and local HTTP servers. It requires no external accounts or provider credentials and submits no image or Rodin generation requests. Test outputs go to the ignored `.test-results/` directory.

`test-*.mjs` contains runnable suites; `test-runtime.mjs` supplies shared browser configuration; `fixtures/` contains test data. Build and asset inspection helpers remain in `scripts/`.

Existing feature commands remain available in `package.json`. For example:

```sh
npm test
npm run test:inbox
npm run test:mods
npm run test:performance
node tests/test-rodin-config.mjs
node scripts/run-regression.mjs social-store social-feed
```

Browser and Electron suites require a running application, locally installed browser/runtime dependencies, and the applicable scene assets. Start the web application with `npm start` in another terminal. Set `FOREST_TEST_URL` to override its URL and `FOREST_TEST_OUTPUT` to choose a report directory. `npm run test:regression` includes browser suites; it is broader than the offline CI baseline.

Asset validation and visual suites are intentionally separate from the baseline. Their prerequisites and provider behavior must be reviewed before running them; passing the baseline does not establish visual quality, desktop behavior, or Android packaging.

Screenshots stay in `.test-results/` by default. The suites that support updating documentation images require an explicit `--screenshots` argument, for example `node tests/test-inbox-browser.mjs --screenshots`.
