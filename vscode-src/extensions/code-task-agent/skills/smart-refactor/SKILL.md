---
name: smart-refactor
description: Safe refactoring protocol: preserves public interfaces, ensures baseline tests pass, and applies incremental changes.
---

# Smart & Safe Refactoring Protocol

When restructuring or optimizing existing code, follow these safety principles:

## 1. Establish Baseline Before Changing
- Run existing tests first to ensure the codebase is green before refactoring.
- If no tests exist for the target module, write basic regression tests first.

## 2. Preserve Public Interfaces & Contracts
- Keep function signatures, parameter names, exported types, and return shapes compatible.
- If breaking changes are strictly necessary, search all callers across the workspace with `grep_search` and update them simultaneously.

## 3. Small Incremental Steps
- Make one atomic refactoring step at a time (e.g. extract function -> test -> rename variable -> test -> simplify logic -> test).
- Avoid massive single-step rewrites that make diagnosing new regressions difficult.

## 4. Final Validation
- Run full typecheck and test suite to confirm zero behavioral regressions.
