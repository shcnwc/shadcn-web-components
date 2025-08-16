import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join } from 'path';

const distDir = join(__dirname, '..', 'dist');

// Publish root package
const rootPkgPath = join(distDir, 'package.json');
if (readdirSync(distDir, { withFileTypes: true }).some(f => f.name === 'package.json')) {
  console.log(`Publishing ${distDir}`);
  execSync(`npm publish --access public`, { cwd: distDir, stdio: 'inherit' });
} else {
  console.error(`Root package.json not found at ${rootPkgPath}`);
  process.exit(1);
}

// Publish sub-component packages
const folders = readdirSync(distDir, { withFileTypes: true });
for (const folder of folders) {
  if (!folder.isDirectory()) continue;
  const pkgDir = join(distDir, folder.name);
  const pkgPath = join(pkgDir, 'package.json');
  if (readdirSync(pkgDir, { withFileTypes: true }).some(f => f.name === 'package.json')) {
    console.log(`Publishing ${pkgDir}`);
    execSync(`npm publish --access public`, { cwd: pkgDir, stdio: 'inherit' });
  }
}