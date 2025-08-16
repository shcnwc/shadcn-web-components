import { promises as fs } from 'fs';
import { join } from 'path';

const version = process.argv[2];
if (!version) {
  console.error('No version provided');
  process.exit(1);
}

const updatePackageJson = async (pkgPath) => {
  try {
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
    pkg.version = version;
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`Updated version in ${pkgPath} to ${version}`);
  } catch (error) {
    console.warn(`Package.json not found or error updating ${pkgPath}: ${error.message}`);
  }
};

// Update component packages in dist
const distDir = join(__dirname, '..', 'dist');
try {
  const folders = await fs.readdir(distDir, { withFileTypes: true });
  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    const pkgPath = join(distDir, folder.name, 'package.json');
    await updatePackageJson(pkgPath);
  }
} catch (error) {
  console.error(`Error reading dist directory: ${error.message}`);
}

// Update root package in dist
const rootPkgPath = join(distDir, 'package.json');
await updatePackageJson(rootPkgPath);

// Update root package in project root
const projectRootPkgPath = join(__dirname, '..', 'package.json');
await updatePackageJson(projectRootPkgPath);