---
name: systematic-debugging
description: Step-by-step scientific debugging methodology: root-cause analysis, hypothesis testing, and multi-strategy fixes.
---

# Systematic Debugging & Problem-Solving Protocol

When facing bugs, test failures, or build errors, follow this 4-step scientific protocol:

## 1. Traceback & Error Analysis
- Read the entire error message, stack trace, and exact line numbers.
- Identify the root error type (e.g., TypeError, ReferenceError, TS2304, AssertionError) rather than jumping to assumptions.
- Locate the exact file and line where the failure originated using `read_file`.

## 2. Hypothesis Formulation
- State clearly: *Why did this failure occur?* (e.g., "Variable X is undefined because function Y returned null on edge case Z").
- Do NOT guess solutions randomly. Trace the data flow upstream from the failure point.

## 3. Root Cause Fix (NO Superficial Symptom Patches)
- Fix the underlying cause, not just the symptom:
  - NEVER fix an error by swallowing exceptions (`try { ... } catch {}` with empty handlers).
  - NEVER fix tests by deleting or disabling failing assertions.
  - NEVER return dummy/mock fallbacks in production code to mask a crash.
- If strategy 1 fails, revert or adjust and try at least 3 distinct fix strategies before reporting a blocker.

## 4. Regression Check
- Re-run the failing test or command to confirm the fix works.
- Verify that other existing tests in the suite still pass.
