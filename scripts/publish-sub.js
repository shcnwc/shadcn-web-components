const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

// Publish root package
const rootPkgPath = path.join(distDir, 'package.json');
if (fs.existsSync(rootPkgPath)) {
  console.log(`Publishing ${distDir}`);
  execSync(`npm publish --access public`, { cwd: distDir, stdio: 'inherit' });
} else {
  console.error(`Root package.json not found at ${rootPkgPath}`);
  process.exit(1);
}

// Publish sub-component packages
const folders = fs.readdirSync(distDir, { withFileTypes: true });
for (const folder of folders) {
  if (!folder.isDirectory()) continue;
  const pkgDir = path.join(distDir, folder.name);
  const pkgPath = path.join(pkgDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    console.log(`Publishing ${pkgDir}`);
    execSync(`npm publish --access public`, { cwd: pkgDir, stdio: 'inherit' });
  }
}