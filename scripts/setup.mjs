import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IDE_ROOT = path.resolve(__dirname, '..');
const WORKSPACE_ROOT = path.resolve(IDE_ROOT, '..');
const PLUGIN_ROOT = path.resolve(WORKSPACE_ROOT, 'Code task Plugin vs Code');
const VSCODE_SRC = path.resolve(IDE_ROOT, 'vscode-src');
const CONFIG_DIR = path.resolve(IDE_ROOT, 'config');

const VSCODE_VERSION = process.env.VSCODE_VERSION || '1.93.1';
const VSCODE_REPO = 'https://github.com/microsoft/vscode.git';

console.log('====================================================');
console.log('   Code Task IDE — Standalone Engine Setup          ');
console.log('====================================================\n');

// 1. Build plugin extension bundle
console.log('📦 [1/5] Building Code Task Agent Bundle...');
if (fs.existsSync(PLUGIN_ROOT)) {
  execSync('npm run build', { cwd: PLUGIN_ROOT, stdio: 'inherit' });
} else {
  console.warn(`[WARN] Plugin directory not found at: ${PLUGIN_ROOT}`);
}

// 2. Clone VS Code source
if (!fs.existsSync(VSCODE_SRC)) {
  console.log(`\n📥 [2/5] Cloning VS Code Core (version tag: ${VSCODE_VERSION})...`);
  console.log('Downloading base editor engine from GitHub...');
  execSync(`git clone --depth 1 --branch ${VSCODE_VERSION} ${VSCODE_REPO} "${VSCODE_SRC}"`, {
    stdio: 'inherit',
  });
} else {
  console.log(`\n⚡ [2/5] Found existing VS Code source at: ${VSCODE_SRC}`);
}

// 3. Inject product.json (Rebrand to Code Task)
console.log('\n🎨 [3/5] Applying Code Task Branding & Open VSX Gallery...');
const customProductPath = path.join(CONFIG_DIR, 'product.json');
const targetProductPath = path.join(VSCODE_SRC, 'product.json');

if (fs.existsSync(customProductPath)) {
  const customProduct = JSON.parse(fs.readFileSync(customProductPath, 'utf8'));
  fs.writeFileSync(targetProductPath, JSON.stringify(customProduct, null, 2), 'utf8');
  console.log('  -> Updated product.json successfully (Cleaned all 3rd party/Microsoft telemetry & endpoints).');
}

// 4. Inject Agent as Built-in Extension
console.log('\n🔌 [4/5] Injecting Code Task Agent into Built-in Extensions...');
const builtinExtDir = path.join(VSCODE_SRC, 'extensions', 'code-task-agent');
if (!fs.existsSync(builtinExtDir)) {
  fs.mkdirSync(builtinExtDir, { recursive: true });
}

function copyDirRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(PLUGIN_ROOT)) {
  const filesToCopy = ['package.json', 'README.md', 'LICENSE', 'AGENTS.md'];
  const dirsToCopy = ['dist', 'media', 'skills'];

  for (const file of filesToCopy) {
    const src = path.join(PLUGIN_ROOT, file);
    const dest = path.join(builtinExtDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  for (const dir of dirsToCopy) {
    const src = path.join(PLUGIN_ROOT, dir);
    const dest = path.join(builtinExtDir, dir);
    if (fs.existsSync(src)) {
      copyDirRecursive(src, dest);
    }
  }
  console.log(`  -> Code Task Agent embedded at: ${builtinExtDir}`);
}

// 5. Update Application Icon
console.log('\n🖼️  [5/5] Updating Application Icons...');
const pluginIconPng = path.join(PLUGIN_ROOT, 'media', 'icon.png');
if (fs.existsSync(pluginIconPng)) {
  const linuxIconDest = path.join(VSCODE_SRC, 'resources', 'linux', 'code.png');
  if (fs.existsSync(path.dirname(linuxIconDest))) {
    fs.copyFileSync(pluginIconPng, linuxIconDest);
  }
}

// 6. Inject Directory.Build.props & Directory.Build.targets for MSBuild on Windows
const propsContent = `<Project>\n  <PropertyGroup>\n    <SpectreMitigation>false</SpectreMitigation>\n    <LibraryPath>$(LibraryPath);C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\BuildTools\\VC\\Tools\\MSVC\\14.44.35207\\lib\\x64;</LibraryPath>\n  </PropertyGroup>\n</Project>\n`;
fs.writeFileSync(path.join(VSCODE_SRC, 'Directory.Build.props'), propsContent, 'utf8');
fs.writeFileSync(path.join(VSCODE_SRC, 'Directory.Build.targets'), propsContent, 'utf8');

console.log('\n====================================================');
console.log('✅ Code Task IDE Engine is Ready!');
console.log('You can now run:');
console.log('  npm run build        (or npm run build:win on Windows)');
console.log('====================================================\n');
