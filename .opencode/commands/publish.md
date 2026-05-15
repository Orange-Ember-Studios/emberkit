---
description: Publish a new version of all packages using changesets
---

Publish all packages in the monorepo using changesets. This command will version packages, build them, and publish to npm.

Follow these steps:

1. Run `git status` to check for uncommitted changes
2. If there are uncommitted changes, ask the user to commit them first
3. Run `git fetch origin` and verify we're on the `main` branch
4. Check if there are any pending changesets by running `pnpm changeset status`
5. If no changesets exist, ask the user if they want to create one with `pnpm changeset`
6. Run `pnpm version-packages` to bump versions based on changesets
7. Run `git status` to see the version changes
8. Create a commit with message: `chore: version packages`
9. Run `pnpm release` to build and publish all packages
10. Run `pnpm changeset tag` to create git tags for the released versions
11. Push the commit and tags to remote with `git push --follow-tags`

Rules:
- Always verify we're on the `main` branch before proceeding
- Never skip the build step before publishing
- If any step fails, stop and report the error to the user
- Do NOT force push or use --no-verify flags
- Confirm with the user before pushing to remote

After completion, show a summary of:
- Packages published with their new versions
- Git tags created
- Commit hash for the version bump
