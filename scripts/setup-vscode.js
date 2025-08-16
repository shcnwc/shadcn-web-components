import { promises as fsp } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const htmlDataSrc = join(projectRoot, 'dist', 'html-data.json');
const vscodeDir = join(projectRoot, '.vscode');
const htmlDataDest = join(vscodeDir, 'html-data.json');
const settingsPath = join(vscodeDir, 'settings.json');

async function setupVSCode() {
  try {
    // Ensure .vscode directory exists
    await fsp.mkdir(vscodeDir, { recursive: true });

    // Copy html-data.json to .vscode/html-data.json
    try {
      await fsp.copyFile(htmlDataSrc, htmlDataDest);
      console.log('Copied html-data.json to .vscode/html-data.json');
    } catch (e) {
      console.error('Error copying html-data.json:', e.message);
      console.error('Ensure `npm run build` has been run to generate dist/html-data.json');
      process.exit(1);
    }

    // Read or initialize settings.json
    let settings = {};
    try {
      const settingsContent = await fsp.readFile(settingsPath, 'utf8');
      settings = JSON.parse(settingsContent);
    } catch {
      console.log('No existing .vscode/settings.json found, creating new one');
    }

    // Update html.customData setting
    settings['html.customData'] = settings['html.customData'] || [];
    if (!settings['html.customData'].includes('./html-data.json')) {
      settings['html.customData'].push('./html-data.json');
    }

    // Write updated settings.json
    await fsp.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
    console.log('Updated .vscode/settings.json with html.customData');
  } catch (e) {
    console.error('Error setting up VS Code:', e.message);
    process.exit(1);
  }
}

setupVSCode();