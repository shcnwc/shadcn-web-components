import { promises as fsp } from 'fs';
import { join } from 'path';
import esbuild from 'esbuild';
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
  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    const folderName = folder.name;
    const entryPoint = join(distDir, folderName, 'index.js');
    const outfile = join(distDir, folderName, 'index.js');
    await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      format: 'esm',
      outfile,
      sourcemap: true,
      minify: false,
      treeShaking: true,
    });
  }
  await fsp.rm(join(distDir, 'chunks'), { recursive: true, force: true });
  try { await fsp.rm(join(distDir, 'shadcn-web-components'), { recursive: true, force: true }); } catch {}
};

prepareDist();