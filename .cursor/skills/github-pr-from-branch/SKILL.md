---
name: github-pr-from-branch
description: Creates a GitHub Pull Request from the current branch using GitHub CLI (gh). Use when the user asks to create a PR, open a PR from the current branch, push and create PR, or create a pull request.
---

# Create PR from Current Branch

## Goal

Create a GitHub Pull Request from the current Git branch into the default branch (e.g. `main` or `master`), pushing the branch first if needed.

## Prerequisites

- **GitHub CLI** must be installed and authenticated. Check with:
  - `gh --version`
  - `gh auth status`
- If not installed: direct the user to [GitHub CLI](https://cli.github.com/) and `gh auth login`.

## Workflow

1. **Get current branch**
   - `git branch --show-current`
   - If result is `main` or `master`, do not create a PR; suggest creating a feature branch first.

2. **Ensure branch is pushed**
   - If the branch has no upstream or has unpushed commits, run:
   - `git push -u origin $(git branch --show-current)`
   - Resolve push failures (e.g. conflicts, permission) before creating the PR.

3. **Determine base branch**
   - Default: `main` (fallback `master` if `main` does not exist).
   - If the user specifies a target branch (e.g. `develop`), use that as base.

4. **Create the PR**
   - Use GitHub CLI:
   - `gh pr create --base <base-branch> --head $(git branch --show-current) --title "<title>" --body "<body>"`
   - **Title**: Use the user's wording if given; otherwise derive a short summary from the last commit message (e.g. first line of `git log -1 --pretty=%s`).
   - **Body**: Optional. Use `--body ""` or leave empty; or use the last commit body: `git log -1 --pretty=%b`.

5. **Output**
   - After success, show the PR URL from `gh` output or tell the user the PR was created and where to find it.

## Examples

**Default (base = main):**
```bash
gh pr create --base main --head $(git branch --show-current) --title "feat: add login form"
```

**With body from last commit:**
```bash
gh pr create --base main --head $(git branch --show-current) --title "$(git log -1 --pretty=%s)" --body "$(git log -1 --pretty=%b)"
```

**User specified base branch:**
```bash
gh pr create --base develop --head $(git branch --show-current) --title "fix: resolve redirect loop"
```

## When to Apply

Apply this skill when the user:

- Asks to create a PR or open a pull request.
- Asks to create a PR from the current branch.
- Asks to push the branch and create a PR.
- Mentions "create PR", "open PR", or "make a pull request" in the context of the current branch.
