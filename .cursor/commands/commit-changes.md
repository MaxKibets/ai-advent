# Commit Changes

Commit current repository changes using the project skill `conventional-commit-workflow`.

Required workflow:

1. Read and apply `.cursor/skills/conventional-commit-workflow/SKILL.md` before any git commit action.
2. Inspect both staged and unstaged changes.
3. Split all changes into reviewable logical units.
4. Create as many commits as needed (atomic commits only).
5. Use Conventional Commits format for every commit message.
6. Keep unrelated changes in separate commits.
7. After each commit, run `git status` and continue until all intended changes are committed.
8. Return a concise report:
   - ordered list of created commits
   - short rationale per commit
   - final repository status
