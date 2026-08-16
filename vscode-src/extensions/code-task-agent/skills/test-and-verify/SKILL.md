---
name: test-and-verify
description: Auto-testing and verification protocol. Enforces running build checks, typechecks, and tests before marking tasks complete.
---

# Test & Verify Protocol

Never declare a coding task complete without verifying that the code compiles and passes tests:

## 1. Identify Project Verification Commands
- Check `package.json` scripts, `Makefile`, `pyproject.toml`, or `Cargo.toml` to find test & lint commands.
- Standard checks by language/framework:
  - **TypeScript/JavaScript**: `npm run typecheck` / `npx tsc --noEmit`, `npm test` / `npx vitest run` / `npx jest`, `npm run lint`
  - **Python**: `pytest`, `python -m py_compile <file>`, `mypy`
  - **Rust**: `cargo check`, `cargo test`
  - **Go**: `go test ./...`, `go build`

## 2. Verification Execution Cycle
1. After editing code, run syntax/type check first.
2. If type errors are found, fix them immediately.
3. Run the unit test suite targeting the modified feature.
4. If tests fail, use the `systematic-debugging` procedure.

## 3. Completion Criteria
- Task is only complete when:
  - All modified files have been saved.
  - Type checking passes with 0 errors.
  - Relevant tests pass with 0 failures.
  - No leftover debug logs (`console.log`, temporary print statements) remain in production files.
