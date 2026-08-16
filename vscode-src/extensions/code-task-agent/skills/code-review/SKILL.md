---
name: code-review
description: Review a pull request / diff for bugs, edge cases and style; propose concrete fixes.
---

# Code Review

Use this skill when the user asks to review code, review a diff, or "check for bugs".

## Process

1. **Gather** — read the files involved (use `read_file`/`grep_search`). If a branch/diff is
   mentioned, run `git diff main...HEAD` via `run_terminal_command` (ask for approval when needed).
2. **Analyze** — look for:
   - Logic bugs and off-by-one errors
   - Missing error handling / null checks
   - Concurrency or async issues
   - Security concerns (injection, secrets, path traversal)
   - Style and readability problems
3. **Report** — produce a concise report:
   - **Critical** (blocks merge)
   - **Warnings** (should fix)
   - **Nits** (optional)
   For each finding: file:line, what is wrong, and a concrete suggested fix in a code block.

## Rules

- Do not modify files during review unless the user explicitly asks.
- Back every claim with the actual code (quote the line).
- If nothing is wrong, say so clearly — do not invent issues.
