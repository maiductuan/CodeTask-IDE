# AGENTS.md — Code Task Agent (VS Code extension)

Project context cho AI agent phát triển repo này (dogfooding chuẩn Hermes Agent).

## Dự án

VS Code extension **Code Task Agent**: AI coding agent theo chuẩn Hermes Agent
(skills `SKILL.md` / agentskills.io, context files `AGENTS.md` / `SOUL.md` /
`CONTEXT.md`, memory, MCP), BYOK — người dùng tự cắm API key (OpenAI / Anthropic /
OpenRouter / Ollama / endpoint bất kỳ).

## Lệnh nhanh

- `npm run build` — build extension (`dist/extension.js`) + webview (`dist/webview.js` + `dist/webview.css`) bằng esbuild
- `npm run watch` — watch mode (esbuild, 2 context)
- `npm run typecheck` — `tsc --noEmit` cho cả extension và webview
- `npm run lint` — eslint (flat config)
- `npm test` — vitest run (unit tests, `src/**/*.test.ts`)
- `F5` — Launch Extension Host (debug; preLaunchTask build)
- `npm run package` — đóng gói `.vsix` (vsce)

## Cấu trúc

- `src/extension.ts` — activate/deactivate, commands, status bar
- `src/ui/panel.ts` — WebviewPanel: CSP, messaging (webview <-> extension)
- `src/ui/webview/` — React 18 app (Chat + Settings)
- `src/shared/types.ts` — types dùng chung webview <-> extension
- `esbuild.mjs` — build script (extension CJS + webview IIFE)
- `dist/` — output build (git-ignored)

## Convention

- TypeScript strict, không `any` trừ khi bắt buộc.
- Extension: CommonJS (esbuild bundle, `vscode` external). Webview: React 18, esbuild.
- **Không dùng native module** (ưu tiên sql.js WASM cho SQLite khi cần) — tránh rebuild per-platform.
- Mọi tool call phải hiển thị cho user (observable execution) và có thể cancel.
- Commit message tiếng Anh, conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Chạy `npm run typecheck && npm run lint && npm test` trước khi kết thúc một milestone.

## Lộ trình (milestones)

- M0 ✅ scaffold + build pipeline + webview skeleton (echo pipeline)
- M1 ✅ provider layer (chat.completions / responses / anthropic) + agent loop + streaming (BYOK)
- M2 ✅ tool registry (file read/write/edit, grep, terminal) + tool-call UI + approval modes
- M3 ✅ context files (AGENTS.md / SOUL.md / CONTEXT.md) + skills (SKILL.md, progressive disclosure)
- M4 ✅ memory (sessions + MEMORY.md + SQLite FTS3 qua sql.js)
- M5 ✅ MCP client (@modelcontextprotocol/sdk, stdio, `.mcp.json`)
- M6 ✅ polish: settings UI, approval modes, vsce package, docs

## Chuẩn Hermes đang áp dụng

- Provider-agnostic agent loop, prompt stable (không đổi mid-conversation).
- Skills theo agentskills.io: folder + `SKILL.md` (frontmatter `name`/`description`), progressive disclosure.
- Context files: `AGENTS.md` (project), `SOUL.md` (persona), `CONTEXT.md` (session).
- Memory: `MEMORY.md` + SQLite FTS5.
- MCP: client `@modelcontextprotocol/sdk`, tools merge vào registry.
