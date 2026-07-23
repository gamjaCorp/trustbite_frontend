#!/usr/bin/env node
/* eslint-disable no-console */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const config = JSON.parse(readFileSync(join(ROOT, '.designcheckrc.json'), 'utf8'));

// ── 1. include 패턴 → 파일 목록 ──────────────────────────────────────────
function matchesPattern(filePath, pattern) {
  // "src/app/page.tsx" 같은 리터럴 패턴
  if (!pattern.includes('*')) return filePath === pattern;

  // "src/components/core/**/*.tsx" 같은 glob
  const parts = pattern.split('/');
  const fileParts = filePath.split('/');
  return matchParts(fileParts, parts);
}

function matchParts(fps, pps) {
  if (pps.length === 0) return fps.length === 0;
  if (pps[0] === '**') {
    // ** 는 0개 이상의 디렉토리 세그먼트
    return matchParts(fps, pps.slice(1)) ||
      (fps.length > 0 && matchParts(fps.slice(1), pps));
  }
  if (fps.length === 0) return false;
  const fp = fps[0];
  const pp = pps[0];
  // *.tsx 같은 단일 세그먼트 glob
  if (pp.includes('*')) {
    const re = new RegExp('^' + pp.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
    return re.test(fp) && matchParts(fps.slice(1), pps.slice(1));
  }
  return fp === pp && matchParts(fps.slice(1), pps.slice(1));
}

function collectFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectFiles(full));
    else results.push(full);
  }
  return results;
}

const allFiles = existsSync(join(ROOT, 'src'))
  ? collectFiles(join(ROOT, 'src'))
  : [];

const relativePaths = allFiles.map((f) => relative(ROOT, f).split(sep).join('/'));

const included = relativePaths.filter((f) =>
  config.include.some((pat) => matchesPattern(f, pat))
);
const excluded = new Set(
  (config.exclude || []).map((e) => e.split(sep).join('/'))
);
const files = included.filter((f) => !excluded.has(f));

// ── 2. 룰 정의 ──────────────────────────────────────────────────────────
const rules = {
  'no-raw-color': {
    enabled: config.rules?.['no-raw-color']?.enabled !== false,
    test(line) {
      // 주석 라인 스킵
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return [];
      const hex = line.match(/(?<![&\w/])#[0-9a-fA-F]{3,8}\b/g) || [];
      const rgb = line.match(/\brgba?\s*\([^)]*\)/g) || [];
      return [...hex, ...rgb];
    },
  },
};

// ── 3. 스캔 ──────────────────────────────────────────────────────────────
let issues = 0;
const filesWithIssues = new Set();

for (const relPath of files) {
  const absPath = join(ROOT, relPath);
  if (!existsSync(absPath)) continue;
  const lines = readFileSync(absPath, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const [name, rule] of Object.entries(rules)) {
      if (!rule.enabled) continue;
      const matches = rule.test(line);
      matches.forEach((m) => {
        const col = line.indexOf(m) + 1;
        console.log(`${relPath}:${i + 1}:${col}  ${name}  ${m}`);
        issues++;
        filesWithIssues.add(relPath);
      });
    }
  });
}

// ── 4. 결과 출력 ──────────────────────────────────────────────────────────
if (issues === 0) {
  console.log(`\n✓ design:check passed (${files.length} files scanned)`);
} else {
  console.log(`\n✗ ${issues} issue(s) in ${filesWithIssues.size} file(s)`);
}
process.exit(issues === 0 ? 0 : 1);
