import { promises as fsp } from 'fs';
import { join } from 'path';

const componentsDir = join(process.cwd(), 'src', 'lib');
const distDir = join(process.cwd(), 'dist');

const prepareDist = async () => {
  const folders = await fsp.readdir(componentsDir, { withFileTypes: true });
  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    const srcFolder = join(componentsDir, folder.name);
    const distFolder = join(distDir, folder.name);
    await fsp.mkdir(distFolder, { recursive: true });
    const filesToCopy = ['package.json', 'index.d.ts', 'html-data.json'];
    for (const file of filesToCopy) {
      const srcFile = join(srcFolder, file);
      const distFile = join(distFolder, file);
      try {
        await fsp.copyFile(srcFile, distFile);
      } catch {}
    }
  }
  // Clean up unwanted directories
  await fsp.rm(join(distDir, 'chunks'), { recursive: true, force: true });
  await fsp.rm(join(distDir, 'shadcn-web-components'), { recursive: true, force: true });
  // Copy root html-data.json
  try {
    await fsp.copyFile(join(process.cwd(), 'src', 'html-data.json'), join(distDir, 'html-data.json'));
  } catch {}
};

prepareDist();