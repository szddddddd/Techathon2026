import fs from 'node:fs/promises';
import path from 'node:path';
import config from '../desktop/runtime-config.cjs';
export { chromium, _electron } from 'playwright';
export const baseURL = process.env.FOREST_TEST_URL || `http://localhost:${config.webPort(process.cwd())}`;
export const outputDir = path.resolve(process.env.FOREST_TEST_OUTPUT || '.test-results');
await fs.mkdir(outputDir, { recursive: true });
export const outputPath = name => path.join(outputDir, name);
