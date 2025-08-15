import { promises as fsp } from 'fs';
import { join } from 'path';

const copyTree = async (srcDir, dstDir) => {
  const entries = await fsp.readdir(srcDir, { withFileTypes: true });
  await fsp.mkdir(dstDir, { recursive: true });
  for (const e of entries) {
    const s = join(srcDir, e.name);
    const d = join(dstDir, e.name);
    if (e.isDirectory()) await copyTree(s, d);
    else if (e.isFile() && e.name === 'index.d.ts') await fsp.copyFile(s, d);
  }
};

await copyTree('src/lib', 'dist/lib');
try {
  await fsp.copyFile('src/html-data.json', 'dist/html-data.json');
} catch {}
