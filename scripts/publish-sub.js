const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const folders = fs.readdirSync(distDir, { withFileTypes: true });

for (const folder of folders) {
  if (!folder.isDirectory() || folder.name === 'shadcn-web-components' || folder.name === 'chunks') continue;
  const pkgDir = path.join(distDir, folder.name);
  console.log(`Publishing ${pkgDir}`);
  execSync(`npm publish --access public`, { cwd: pkgDir, stdio: 'inherit' });
}