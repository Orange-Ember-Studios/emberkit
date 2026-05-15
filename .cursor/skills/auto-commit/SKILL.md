---
name: auto-commit
description: Auto-commit all uncommitted changes using semantic commit notation
disable-model-invocation: true
---

---
description: Auto-commit all uncommitted changes using semantic commit notation
---

Analyze all uncommitted changes in the git repository and create small, focused commits using semantic commit notation.

Follow these steps:

1. Run `git status` to see all uncommitted changes
2. Run `git diff` to understand what changed
3. Group related changes into small, logical commits
4. For each group, create a commit using semantic commit format: `type(scope): message`

Semantic commit types:
- `feat` - new feature
- `fix` - bug fix
- `docs` - documentation changes
- `style` - formatting, missing semi-colons, etc
- `refactor` - code refactoring
- `test` - adding or updating tests
- `chore` - maintenance tasks, dependencies, config

Rules:
- Keep commit messages clear and short (under 72 chars)
- Make small, focused commits (one logical change per commit)
- Use the file path or package name as scope when applicable
- Stage only the files for each commit using `git add -p` or specific file paths
- Do NOT commit files that likely contain secrets (.env, credentials.json, etc)

After committing, show a summary of all commits created.
