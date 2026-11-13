import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const e2eTestFiles = [
  'tests/e2e/tier1-feature-coverage.test.mjs',
  'tests/e2e/tier2-boundary-corner-cases.test.mjs',
  'tests/e2e/tier3-cross-feature-combinations.test.mjs',
  'tests/e2e/tier4-application-scenarios.test.mjs',
  'tests/e2e/tier5-adversarial-coverage.test.mjs',
];

console.log('='.repeat(70));
console.log('AZURE MOBILE STOREFRONT REDESIGN — E2E TEST RUNNER');
console.log('='.repeat(70));
console.log(`Running ${e2eTestFiles.length} test tiers against storefront...\n`);

const startTime = Date.now();
let totalPassed = 0;
let totalFailed = 0;

for (const testFile of e2eTestFiles) {
  const fileStart = Date.now();
  console.log(`\n--- Running: ${testFile} ---`);
  const result = spawnSync(process.execPath, ['--test', testFile], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    env: process.env,
  });

  const duration = Date.now() - fileStart;
  if (result.status === 0) {
    console.log(`✔ ${testFile} PASSED (${duration}ms)`);
    totalPassed++;
  } else {
    console.error(`✖ ${testFile} FAILED (${duration}ms, exit code ${result.status})`);
    totalFailed++;
  }
}

const totalDuration = Date.now() - startTime;
console.log('\n' + '='.repeat(70));
console.log('E2E TEST RUNNER SUMMARY');
console.log('='.repeat(70));
console.log(`Total Tiers Executed: ${e2eTestFiles.length}`);
console.log(`Tiers Passed:        ${totalPassed}`);
console.log(`Tiers Failed:        ${totalFailed}`);
console.log(`Total Duration:      ${totalDuration}ms`);
console.log('='.repeat(70));

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log('ALL E2E TEST TIERS PASSED SUCCESSFULLY!\n');
}
