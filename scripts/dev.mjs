import { execSync, spawn } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IDE_ROOT = path.resolve(__dirname, '..');
const WORKSPACE_ROOT = path.resolve(IDE_ROOT, '..');
const PLUGIN_ROOT = path.resolve(WORKSPACE_ROOT, 'Code task Plugin vs Code');
const VSCODE_SRC = path.resolve(IDE_ROOT, 'vscode-src');
const NODE_MODULES = path.resolve(VSCODE_SRC, 'node_modules');

console.log('====================================================');
console.log('   ✦ Code Task IDE — Instant Launch Mode            ');
console.log('====================================================\n');

// 1. Initial setup check (First time only)
if (!fs.existsSync(VSCODE_SRC)) {
  console.log('Engine source not found. Running initial setup...');
  execSync('node scripts/setup.mjs', { cwd: IDE_ROOT, stdio: 'inherit' });
}

// 2. Fast-sync Code Task Agent bundle (takes < 0.2s)
const pluginDist = path.join(PLUGIN_ROOT, 'dist');
const targetExtDist = path.join(VSCODE_SRC, 'extensions', 'code-task-agent', 'dist');

if (fs.existsSync(pluginDist)) {
  if (!fs.existsSync(targetExtDist)) {
    fs.mkdirSync(targetExtDist, { recursive: true });
  }
  const files = fs.readdirSync(pluginDist);
  for (const f of files) {
    fs.copyFileSync(path.join(pluginDist, f), path.join(targetExtDist, f));
  }
}

// Clean environment for native C++ node-gyp
const msvcLibPath = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\BuildTools\\VC\\Tools\\MSVC\\14.44.35207\\lib\\x64';
const cleanEnv = {
  ...process.env,
  VSCODE_SKIP_NODE_VERSION_CHECK: '1',
  npm_config_msvs_version: '2022',
  LIB: (process.env.LIB ? process.env.LIB + ';' : '') + msvcLibPath,
};
delete cleanEnv.npm_execpath;
delete cleanEnv.npm_config_user_agent;
delete cleanEnv.VCINSTALLDIR;
delete cleanEnv.VSINSTALLDIR;
delete cleanEnv.VCToolsInstallDir;

// 3. Dependencies check: Only run heavy yarn install if node_modules is missing
if (!fs.existsSync(NODE_MODULES)) {
  console.log('📦 Installing dependencies with Yarn (First-time only)...');
  execSync('yarn --frozen-lockfile --network-timeout 180000', {
    cwd: VSCODE_SRC,
    env: cleanEnv,
    stdio: 'inherit',
  });
}

// 4. Launch Code Task IDE instantly
console.log('🚀 Launching Code Task IDE...');

if (process.platform === 'win32') {
  const child = spawn('cmd.exe', ['/c', '.\\scripts\\code.bat'], {
    cwd: VSCODE_SRC,
    env: cleanEnv,
    stdio: 'inherit',
  });

  child.on('error', (err) => {
    console.error('Failed to start IDE:', err);
  });
} else {
  const child = spawn('./scripts/code.sh', [], {
    cwd: VSCODE_SRC,
    env: cleanEnv,
    stdio: 'inherit',
  });

  child.on('error', (err) => {
    console.error('Failed to start IDE:', err);
  });
}
