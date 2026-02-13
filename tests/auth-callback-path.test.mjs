import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const walk = (dir) => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else {
      out.push(full.replace(/\\/g, '/'));
    }
  }
  return out;
};

test('only one /auth/callback handler exists and it is route.ts', () => {
  const files = walk('src/app').filter((file) => /auth\/callback\/(page|route)\.(tsx|ts|jsx|js)$/i.test(file));
  assert.deepEqual(files, ['src/app/auth/callback/route.ts']);
});
