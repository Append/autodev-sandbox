# README split (docs realignment #11) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the three over-budget h2 guides out of `README.md` into one `docs/` file each, leaving README as entry point + index, so `autodev-docs-check --all` is clean at HEAD.

**Architecture:** Pure text move. Each README h2 section's body lines are copied verbatim (via `sed -n` line ranges from the base-tip README) under a single h1 in a new `docs/<topic>-guide.md`. README is then rewritten to title + description + a `## Documentation` link index. No code changes.

**Tech Stack:** bash, git, `autodev-docs-check` (plugin gate), `npm test`.

**Spec:** `docs/superpowers/specs/2026-09-03-readme-split-design.md`

## Global Constraints

- Only these paths change: `README.md`, `docs/slugify-guide.md`, `docs/reverse-guide.md`, `docs/math-guide.md` (plus this spec/plan).
- Note lines are copied byte-for-byte; never retype them.
- `/home/steal/code/autodev/plugin/bin/autodev-docs-check --workdir . --base-ref-sha $(git rev-parse origin/main) --preserves origin/main..HEAD` exits 0 before any push.
- Base tip: `b7042a23aa1f2b773ad0c84dc55318a575c8425f`. README line ranges below are for that blob.

---

### Task 1: Create the three guide files from README line ranges

**Files:**
- Create: `docs/slugify-guide.md`
- Create: `docs/reverse-guide.md`
- Create: `docs/math-guide.md`
- Read-only source: `origin/main:README.md`

**Interfaces:**
- Consumes: README at `origin/main` (h2 headings at lines 4, 202, 400; note bodies at 6–200, 204–398, 402–596).
- Produces: three files, each `# <Topic> guide`, blank line, 195 note lines. Task 2 links to these exact paths.

- [ ] **Step 1: Confirm the line ranges (the "failing test": ranges must bracket exactly the notes)**

Run:
```bash
git show origin/main:README.md | sed -n '4p;6p;200p;202p;204p;398p;400p;402p;596p' | cut -c1-40
```
Expected, in order:
```
## Slugify guide
Note 1 on Slugify: behaviour, edge cases
Note 195 on Slugify: behaviour, edge cas
## Reverse guide
Note 1 on Reverse: behaviour, edge cases
Note 195 on Reverse: behaviour, edge cas
## Math guide
Note 1 on Math: behaviour, edge cases an
Note 195 on Math: behaviour, edge cases
```
If any line differs, stop: the ranges are wrong for this base tip.

- [ ] **Step 2: Write the three files**

```bash
{ printf '# Slugify guide\n\n'; git show origin/main:README.md | sed -n '6,200p'; } > docs/slugify-guide.md
{ printf '# Reverse guide\n\n'; git show origin/main:README.md | sed -n '204,398p'; } > docs/reverse-guide.md
{ printf '# Math guide\n\n';    git show origin/main:README.md | sed -n '402,596p'; } > docs/math-guide.md
```

- [ ] **Step 3: Verify each file is h1 + blank + 195 verbatim notes**

```bash
for f in docs/slugify-guide.md docs/reverse-guide.md docs/math-guide.md; do
  echo "$f lines=$(wc -l < "$f") h1=$(grep -c '^# ' "$f") notes=$(grep -c '^Note ' "$f")"
done
diff <(git show origin/main:README.md | sed -n '6,200p')   <(tail -n +3 docs/slugify-guide.md) && echo slugify-ok
diff <(git show origin/main:README.md | sed -n '204,398p') <(tail -n +3 docs/reverse-guide.md) && echo reverse-ok
diff <(git show origin/main:README.md | sed -n '402,596p') <(tail -n +3 docs/math-guide.md)    && echo math-ok
```
Expected: each file `lines=197 h1=1 notes=195`, and the three `-ok` lines.

- [ ] **Step 4: Commit**

```bash
git add docs/slugify-guide.md docs/reverse-guide.md docs/math-guide.md
git commit -m "docs: move Slugify/Reverse/Math guides out of README into docs/"
```

### Task 2: Rewrite README as entry point + index

**Files:**
- Modify: `README.md` (whole file)

**Interfaces:**
- Consumes: the three files from Task 1 at the exact paths above, plus existing `docs/utilities.md`.
- Produces: README of 10 lines, one h1, one h2.

- [ ] **Step 1: Write the new README**

```bash
cat > README.md <<'MD'
# autodev-sandbox
Throwaway sandbox repo for autodev E2E dry runs.

## Documentation

- [Utilities](docs/utilities.md) — exported functions at a glance.
- [Slugify guide](docs/slugify-guide.md) — behaviour notes for `slugify(str)`.
- [Reverse guide](docs/reverse-guide.md) — behaviour notes for `reverse(str)`.
- [Math guide](docs/math-guide.md) — behaviour notes for `add(a, b)` and `mul(a, b)`.
MD
```

- [ ] **Step 2: Verify link targets exist and the description line is unchanged**

```bash
for t in docs/utilities.md docs/slugify-guide.md docs/reverse-guide.md docs/math-guide.md; do test -f "$t" && echo "ok $t"; done
diff <(git show origin/main:README.md | sed -n '1,2p') <(sed -n '1,2p' README.md) && echo header-unchanged
```
Expected: four `ok` lines and `header-unchanged`.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: README is entry point + index; guides live in docs/"
```

### Task 3: Run every gate the unit contract names

**Files:** none modified.

- [ ] **Step 1: Docs gate, touched-files mode**

```bash
/home/steal/code/autodev/plugin/bin/autodev-docs-check --workdir . --base-ref-sha $(git rev-parse origin/main); echo "exit=$?"
```
Expected: no output, `exit=0`.

- [ ] **Step 2: Pure-move verdict**

```bash
/home/steal/code/autodev/plugin/bin/autodev-docs-check --workdir . --base-ref-sha $(git rev-parse origin/main) --preserves origin/main..HEAD; echo "exit=$?"
```
Expected: no output, `exit=0`. A `docs-content-lost` line means a note was altered; redo Task 1 Step 2 for that file.

- [ ] **Step 3: Whole-tree acceptance check**

```bash
/home/steal/code/autodev/plugin/bin/autodev-docs-check --workdir . --base-ref-sha $(git rev-parse origin/main) --all; echo "exit=$?"
```
Expected: no output, `exit=0`.

- [ ] **Step 4: Tests and lint**

```bash
npm test 2>&1 | tail -8; npm run lint
```
Expected: `fail 0` and a nonzero `pass` count (the count varies by Node version: 16 with subtests counted, 3 otherwise); lint exits 0.

- [ ] **Step 5: Confirm only docs changed**

```bash
git diff --name-status origin/main..HEAD
```
Expected: `M README.md`, `A docs/math-guide.md`, `A docs/reverse-guide.md`, `A docs/slugify-guide.md`, and the spec/plan under `docs/superpowers/`.
