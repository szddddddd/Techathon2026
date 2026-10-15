import { spawn } from 'node:child_process';
const suites = process.argv.slice(2);
const names = suites.length ? suites : ['social-store','social-feed','discovery-store','pet-state','desktop-bridge','web-pet','pet-cold-start'];
for (const name of names) {
  if (!/^[a-z-]+$/.test(name)) throw new Error('Invalid suite name');
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [`scripts/test-${name}.mjs`], { stdio: 'inherit', env: process.env });
    child.once('error', reject); child.once('exit', code => resolve(code ?? 1));
  });
  if (code) { process.exitCode = code; break; }
}
