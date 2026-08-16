---
name: code-editing-hygiene
description: Standard operating procedure for safe, targeted code editing. Prevents wiping files, placeholder omissions, and hallucinated imports.
---

# Code Editing Hygiene & Discipline Protocol

When editing code, follow these strict rules to ensure changes are accurate, surgical, and maintain code integrity:

## 1. Context Inspection First
- NEVER edit a file blindly without reading it first.
- Always use `read_file` with line numbers around the target area (at least 20-30 lines before and after) to confirm exact imports, indentation, variable names, and surrounding logic.
- Use `grep_search` to locate all references and usages across the workspace before modifying function signatures or exports.

## 2. Surgical & Targeted Edits
- PREFER `edit_file` for existing files over `write_file`.
- `edit_file` replaces only the specified `oldText` with `newText`. Provide enough context in `oldText` (3-5 surrounding lines) so the match is unique in the file.
- NEVER replace an entire 500+ line file with `write_file` unless you are creating a brand new file or doing a complete rewrite.

## 3. ZERO Placeholder Omissions
- NEVER use placeholders like `// ... rest of code`, `/* existing implementation */`, or `# TODO: keep previous`.
- Always write the complete, functional code for every replaced segment.

## 4. Style & Comment Preservation
- Preserve existing comments, docstrings, formatting, and indentation (spaces vs tabs, quote styles).
- Follow the project's established conventions (e.g. TypeScript strict types, error handling patterns, naming schemes).
