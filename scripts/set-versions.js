const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) {
  console.error('No version provided');
  process.exit(1);
}

const libDir = path.join(__dirname, '..', 'src', 'lib');
const folders = fs.readdirSync(libDir, { withFileTypes: true });

for (const folder of folders) {
  if (!folder.isDirectory()) continue;
  const pkgPath = path.join(libDir, folder.name, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.version = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }
}

// Also set root version, though semantic-release handles it
const rootPkgPath = path.join(__dirname, '..', 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
rootPkg.version = version;
fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2));