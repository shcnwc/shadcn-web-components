const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) {
  console.error('No version provided');
  process.exit(1);
}

const updatePackageJson = (pkgPath) => {
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.version = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`Updated version in ${pkgPath} to ${version}`);
  } else {
    console.warn(`Package.json not found at ${pkgPath}`);
  }
};

// Update component packages in dist
const distDir = path.join(__dirname, '..', 'dist');
const folders = fs.readdirSync(distDir, { withFileTypes: true });
for (const folder of folders) {
  if (!folder.isDirectory()) continue;
  const pkgPath = path.join(distDir, folder.name, 'package.json');
  updatePackageJson(pkgPath);
}

// Update root package in dist
const rootPkgPath = path.join(distDir, 'package.json');
updatePackageJson(rootPkgPath);

// Update root package in project root
const projectRootPkgPath = path.join(__dirname, '..', 'package.json');
updatePackageJson(projectRootPkgPath);