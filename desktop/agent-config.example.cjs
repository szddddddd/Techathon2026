// Copy to .weroam-private/agent-config.cjs; the private directory is Git-ignored.
// This file is loaded only by the trusted Electron process, never by scene bundles.
module.exports = {
  apiKey: '', // Fill locally. Do not add a real credential to this example.
};
