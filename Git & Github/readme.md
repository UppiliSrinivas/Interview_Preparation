# Top 15 Git & GitHub Interview Questions and Answers

---

## 1. What is the difference between Git and GitHub?

### Answer

**Git** is a distributed version control system used to track source code changes.

**GitHub** is a cloud-based platform that hosts Git repositories and provides collaboration features like Pull Requests, Code Reviews, CI/CD, and Issue Tracking.

**Example:**

- Git = Tool
- GitHub = Platform that uses Git

---

## 2. What is the difference between Git Pull and Git Fetch?

### Answer

### Git Fetch

Downloads latest changes from the remote repository but does not merge them into the current branch.

```bash
git fetch origin
```

### Git Pull

Fetches changes and automatically merges them into the current branch.

```bash
git pull origin main
```

### Difference

| Git Fetch | Git Pull |
|------------|-----------|
| Downloads changes only | Downloads + Merges |
| Safe operation | May create merge conflicts |
| Lets you review changes first | Directly updates branch |

---

## 3. What is the difference between Merge and Rebase?

### Answer

### Merge

Combines branches while preserving history.

```bash
git merge feature-branch
```

Creates a merge commit.

### Rebase

Moves feature branch commits on top of another branch.

```bash
git rebase main
```

Creates a cleaner linear history.

### Difference

| Merge | Rebase |
|---------|---------|
| Preserves history | Rewrites history |
| Creates merge commit | No merge commit |
| Safer for shared branches | Best for local branches |

---

## 4. What is the difference between Reset and Revert?

### Answer

### Reset

Moves branch pointer backward and removes commits.

```bash
git reset HEAD~1
```

### Revert

Creates a new commit that undoes previous changes.

```bash
git revert <commit-id>
```

### Difference

| Reset | Revert |
|---------|---------|
| Removes commit history | Preserves history |
| Rewrites history | Safe for shared branches |
| Local use | Production use |

---

## 5. What is the difference between Soft, Mixed, and Hard Reset?

### Answer

### Soft Reset

```bash
git reset --soft HEAD~1
```

- Removes commit
- Keeps changes staged

### Mixed Reset (Default)

```bash
git reset --mixed HEAD~1
```

- Removes commit
- Keeps changes in working directory

### Hard Reset

```bash
git reset --hard HEAD~1
```

- Removes commit
- Removes staged changes
- Removes working directory changes

### Summary

| Type | Commit | Staging | Working Directory |
|--------|---------|---------|---------|
| Soft | Removed | Kept | Kept |
| Mixed | Removed | Removed | Kept |
| Hard | Removed | Removed | Removed |

---

## 6. What is Git Stash?

### Answer

Git Stash temporarily saves uncommitted changes without creating a commit.

```bash
git stash
```

Useful when switching branches quickly.

Restore changes:

```bash
git stash pop
```

---

## 7. What is Cherry Pick?

### Answer

Cherry Pick copies a specific commit from one branch to another.

```bash
git cherry-pick <commit-id>
```

### Example

A production bug fix exists in another branch and needs to be applied immediately.

Instead of merging the entire branch, use Cherry Pick.

---

## 8. What is a Merge Conflict?

### Answer

A Merge Conflict occurs when Git cannot automatically determine which changes to keep.

### Example

Developer A:

```js
const name = "John";
```

Developer B:

```js
const name = "Nivas";
```

When merging, Git asks for manual resolution.

---

## 9. How do you resolve Merge Conflicts?

### Answer

### Steps

1. Pull latest changes.
2. Open conflicted files.
3. Find conflict markers.

```text
<<<<<<< HEAD
Current code
=======
Incoming code
>>>>>>> feature
```

4. Decide final code.
5. Remove conflict markers.
6. Stage file.

```bash
git add .
```

7. Complete merge.

```bash
git commit
```

---

## 10. What is a Pull Request (PR)?

### Answer

A Pull Request is a request to merge code from one branch into another.

### Purpose

- Code review
- Discussion
- Automated testing
- Approval workflow

### Typical Flow

```text
Feature Branch
      ↓
Pull Request
      ↓
Code Review
      ↓
Approval
      ↓
Merge
```

---

## 11. What is a Branching Strategy?

### Answer

A Branching Strategy defines how teams organize and manage branches.

### Common Branches

```text
main
develop
feature/*
release/*
hotfix/*
```

Benefits:

- Organized development
- Safer releases
- Easier collaboration

---

## 12. Explain Git Flow.

### Answer

Git Flow is a popular branching model.

### Branch Structure

```text
main
develop
feature/*
release/*
hotfix/*
```

### Workflow

1. Create feature branch from develop.
2. Merge feature into develop.
3. Create release branch.
4. Release branch merged into main.
5. Hotfix branches created from main when needed.

Best suited for enterprise projects.

---

## 13. What is a Squash Commit?

### Answer

Squash combines multiple commits into a single commit.

### Example

Before:

```text
Fix UI
Fix Button
Fix API
Fix Review Comments
```

After Squash:

```text
Implement Login Feature
```

Command:

```bash
git rebase -i HEAD~4
```

Benefits:

- Cleaner history
- Easier code review
- Better release tracking

---

## 14. Explain your team's Git Workflow.

### Answer

In my current project:

1. Pull latest changes from develop.
2. Create feature branch.

```bash
git checkout -b feature/login
```

3. Develop feature.
4. Commit changes regularly.
5. Push branch.

```bash
git push origin feature/login
```

6. Create Pull Request.
7. Peer review and CI validation.
8. Resolve comments.
9. Merge into develop.
10. Release team promotes code to production.

---

## 15. Explain a Git issue you faced and how you resolved it.

### Answer

### Situation

Two developers modified the same React Native component and a merge conflict occurred.

### Problem

Git could not automatically merge the file.

### Resolution

1. Pulled latest develop branch.
2. Identified conflict markers.
3. Compared both implementations.
4. Kept required changes from both developers.
5. Tested application locally.
6. Completed merge and pushed changes.

### Result

Conflict resolved successfully without losing code and the feature was released on schedule.
