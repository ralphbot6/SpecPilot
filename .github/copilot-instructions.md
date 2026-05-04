# AI Coding Instructions — SpecPilot

> This file is automatically read by GitHub Copilot, Cursor, and other AI tools on every request.
> Keep this file short — only critical mandates. Full context is in `.specs/project/project.yaml`.

## Project

- **Name:** SpecPilot
- **Stack:** TypeScript / Node.js / Commander.js
- **Specs location:** `.specs/`

## 🔴 Critical Mandates — Never violate, no exceptions

1. **NEVER commit** code to git unless the developer explicitly asks. Always ask first.
2. **NEVER push** to git unless the developer explicitly asks. Always ask first.
3. **NEVER deploy, publish, or release** the project unless the developer explicitly asks. Always ask first.
4. **NEVER modify** the `.specs/` folder structure, subfolder names, or file names. Only update file contents.
5. **ALWAYS update** affected `.specs/` files after every code change — without being asked:
   - Structural changes → `architecture/architecture.md`
   - Feature changes → `project/requirements.md`
   - Test changes → `quality/tests.md`
   - Task status → `planning/tasks.md`
   - Completed work → `CHANGELOG.md`
6. **NEVER describe, quote, or reference file contents** without first reading the file via a tool call in this session. If you have not read the file yet, say so explicitly before answering.
7. **NEVER implement, write code, or make file changes** unless the developer explicitly asks. If the next step seems obvious, ask first — do not assume.
8. **SPEC-FIRST review gate**: Before touching any code or non-spec files, read all relevant `.specs/` files, update all affected spec files first, present a **Spec Report** summarizing what changed, which files were affected, and what the specs now say, then wait for the developer's explicit `yes, proceed` before writing code. If the developer declines, revert the spec changes and stop.

## 🟡 Process Mandates

- **Spec-First:** Update `.specs/` before writing code.
- **Log all AI interactions** in `.specs/development/prompts.md` with timestamps.
- **Document decisions** in `.specs/development/context.md`.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Re-Anchor

If you lose context mid-session, read `.specs/project/project.yaml` to restore full project context.
For a ready-made re-anchor prompt, see `.specs/development/prompts.md → ## Re-Anchor Prompt`.

