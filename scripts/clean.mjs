import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IDE_ROOT = path.resolve(__dirname, '..');
const VSCODE_SRC = path.resolve(IDE_ROOT, 'vscode-src');

console.log('Cleaning up VS Code source directory...');
if (fs.existsSync(VSCODE_SRC)) {
  fs.rmSync(VSCODE_SRC, { recursive: true, force: true });
  console.log('Cleaned vscode-src directory.');
} else {
  console.log('No build cache to clean.');
}
