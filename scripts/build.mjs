import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IDE_ROOT = path.resolve(__dirname, '..');
const VSCODE_SRC = path.resolve(IDE_ROOT, 'vscode-src');

console.log('====================================================');
console.log('   Code Task IDE — Local Compiler & Packager        ');
console.log('====================================================\n');

if (!fs.existsSync(VSCODE_SRC)) {
  console.log('VS Code source not found. Running setup step first...');
  execSync('node scripts/setup.mjs', { cwd: IDE_ROOT, stdio: 'inherit' });
}

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

const args = process.argv.slice(2);
const targetArg = args.find((a) => a.startsWith('--target='));
const specifiedTarget = targetArg ? targetArg.split('=')[1] : null;

const platform = process.platform;
console.log(`Host Platform: ${platform} | Specified Target: ${specifiedTarget || 'auto-detect'}`);

try {
  console.log('\n📦 [1/3] Installing Dependencies for VS Code Engine...');
  try {
    execSync('yarn --version', { stdio: 'ignore' });
    execSync('yarn --frozen-lockfile --network-timeout 180000', {
      cwd: VSCODE_SRC,
      env: cleanEnv,
      stdio: 'inherit',
    });
  } catch {
    console.log('Yarn not found, fallback to npm install...');
    execSync('npm install --legacy-peer-deps', {
      cwd: VSCODE_SRC,
      env: cleanEnv,
      stdio: 'inherit',
    });
  }

  console.log('\n🔨 [2/3] Compiling Code Task IDE Core & Built-in Agent...');
  execSync('npm run compile', { cwd: VSCODE_SRC, env: cleanEnv, stdio: 'inherit' });

  console.log('\n🚀 [3/3] Packaging Application Executable...');
  const target = specifiedTarget || (platform === 'win32' ? 'win32-x64' : platform === 'darwin' ? (process.arch === 'arm64' ? 'darwin-arm64' : 'darwin-x64') : 'linux-x64');

  console.log(`Gulp Target: vscode-${target}`);
  execSync(`npx gulp vscode-${target}`, { cwd: VSCODE_SRC, env: cleanEnv, stdio: 'inherit' });
  
  const outDir = path.join(IDE_ROOT, `VSCode-${target}`);
  console.log('\n🎉 Build Success! Executable folder:');
  console.log(`   ${outDir}`);
} catch (error) {
  console.error('\n❌ Build Error:', error.message);
  process.exit(1);
}
