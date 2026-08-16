import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IDE_ROOT = path.resolve(__dirname, '..');
const WORKSPACE_ROOT = path.resolve(IDE_ROOT, '..');
const PLUGIN_ROOT = path.resolve(WORKSPACE_ROOT, 'Code task Plugin vs Code');
const VSCODE_SRC = path.resolve(IDE_ROOT, 'vscode-src');

const iconPngPath = path.join(PLUGIN_ROOT, 'media', 'icon.png');
if (!fs.existsSync(iconPngPath)) {
  console.error(`icon.png not found at ${iconPngPath}`);
  process.exit(1);
}

const pngBuffer = fs.readFileSync(iconPngPath);

// Create valid Windows .ico with PNG payload
function createIco(pngBuf) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(0, 0); // 256px
  dirEntry.writeUInt8(0, 1); // 256px
  dirEntry.writeUInt8(0, 2); // color count
  dirEntry.writeUInt8(0, 3); // reserved
  dirEntry.writeUInt16LE(1, 4); // color planes
  dirEntry.writeUInt16LE(32, 6); // bpp
  dirEntry.writeUInt32LE(pngBuf.length, 8); // size
  dirEntry.writeUInt32LE(22, 12); // offset (6+16)

  return Buffer.concat([header, dirEntry, pngBuf]);
}

const icoBuffer = createIco(pngBuffer);

// Targets
const targets = [
  { dest: path.join(VSCODE_SRC, 'resources', 'win32', 'code.ico'), data: icoBuffer },
  { dest: path.join(VSCODE_SRC, 'resources', 'win32', 'default.ico'), data: icoBuffer },
  { dest: path.join(VSCODE_SRC, 'resources', 'linux', 'code.png'), data: pngBuffer },
  { dest: path.join(VSCODE_SRC, 'resources', 'darwin', 'code.png'), data: pngBuffer },
  { dest: path.join(VSCODE_SRC, 'resources', 'win32', 'code_150x150.png'), data: pngBuffer },
  { dest: path.join(VSCODE_SRC, 'resources', 'win32', 'code_70x70.png'), data: pngBuffer },
];

for (const { dest, data } of targets) {
  if (fs.existsSync(path.dirname(dest))) {
    fs.writeFileSync(dest, data);
    console.log(`Updated icon: ${dest}`);
  }
}

// Copy icon to extension dist and media
fs.copyFileSync(iconPngPath, path.join(VSCODE_SRC, 'extensions', 'code-task-agent', 'media', 'icon.png'));
console.log('✅ All application and extension icons updated with icon.png!');
