---
name: conventional-commit-workflow
description: Creates and applies Conventional Commit messages with atomic commit planning. Use when writing commits, preparing git history, splitting changes, or when the user asks for Conventional Commits, clean commit structure, or commit-by-logic workflows.
---

# Conventional Commit Workflow

## Goal

Produce a clean, reviewable git history using Conventional Commits:

- Break all code into reviewable pieces by logic.
- Make as many commits as needed to keep each commit atomic.

## Required Commit Format

Use this structure:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Allowed Types (Default Set)

Use the most specific type that matches intent:

- `feat`: new user-facing functionality
- `fix`: bug fix
- `refactor`: internal code change without behavior change
- `perf`: performance improvement
- `docs`: documentation-only changes
- `test`: test-only changes
- `build`: build system or dependency changes
- `ci`: CI/CD configuration changes
- `chore`: maintenance work not covered above

Use lowercase for type and description unless project conventions say otherwise.

## Atomic Commit Rules

Always enforce these rules before committing:

1. Split changes by logical concern, not by file size.
2. Never mix unrelated concerns in one commit.
3. Separate formatting-only changes from behavior changes.
4. Separate refactors from bug fixes unless inseparable.
5. Create as many commits as needed for easy review.

## Commit Planning Workflow

Follow this sequence:

1. Inspect all staged and unstaged changes.
2. Group changes into logical units.
3. Propose a commit list in order, one line per commit:
   - `<type>(optional-scope): short description`
4. Stage and commit one logical unit at a time.
5. Re-check status after each commit until done.

## Message Writing Rules

- Description is imperative and concise.
- Explain why in body when context is needed.
- Add `BREAKING CHANGE:` footer for incompatible changes.
- Use scope when it clarifies area (for example `feat(auth): ...`).
- Do not claim behavior not present in the diff.

## Quality Gate Before Each Commit

Before creating a commit, verify:

- The staged diff matches exactly one logical purpose.
- Tests or checks relevant to that purpose are handled.
- The commit can be reverted independently with minimal side effects.

If any check fails, split further and commit in smaller pieces.

## Examples

```text
feat(auth): add refresh token rotation
```

```text
fix(api): return 400 for invalid pagination params

Reject negative page values to prevent incorrect query offsets.
```

```text
refactor(ui): extract shared modal footer actions
```

```text
chore!: drop Node 18 support

BREAKING CHANGE: runtime now requires Node 20 or newer.
```

## When This Skill Must Be Applied

Apply this skill whenever:

- The user asks to commit changes.
- The user asks for commit message help.
- Work includes multiple concerns that should be split.
- The user requests Conventional Commits or cleaner git history.
