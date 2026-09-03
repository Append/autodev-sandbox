# README split map (docs realignment, issue #11)

## Problem

`autodev-docs-check --all` at base tip `b7042a2` trips `docs-file-lines` on
`README.md`: 597 lines against a 300-line budget. Three h2 sections carry the
bulk, each 197 lines against an 80-line section budget:

- `## Slugify guide` (README lines 4–201)
- `## Reverse guide` (README lines 202–399)
- `## Math guide` (README lines 400–597)

Each section is a flat run of 195 single-line notes (`Note N on <Topic>: ...`)
with no sub-topics, no h3 headings, no code fences and no links.

## Split map

| Source h2 in README.md | Destination | Heading in destination |
|---|---|---|
| `## Slugify guide` | `docs/slugify-guide.md` (new) | `# Slugify guide` |
| `## Reverse guide` | `docs/reverse-guide.md` (new) | `# Reverse guide` |
| `## Math guide` | `docs/math-guide.md` (new) | `# Math guide` |

Each destination file is: the h1, a blank line, then the section's 195 note
lines byte-for-byte as they appear in README at the base tip. The section
becomes the file, per the docs charter ("a section that outgrows its budget
becomes a file"). No h2/h3 subdivisions are added inside the new files: the
notes are a flat numbered list with no inherent grouping, so any heading would
invent structure that is not in the source. Each file is ~197 lines, under
the 300-line file budget, with a single h1.

## What README keeps

```
# autodev-sandbox
Throwaway sandbox repo for autodev E2E dry runs.

## Documentation

- [Utilities](docs/utilities.md) — exported functions at a glance.
- [Slugify guide](docs/slugify-guide.md) — behaviour notes for `slugify(str)`.
- [Reverse guide](docs/reverse-guide.md) — behaviour notes for `reverse(str)`.
- [Math guide](docs/math-guide.md) — behaviour notes for `add(a, b)` and `mul(a, b)`.
```

README is the entry point and index only: title, the one-line description
that already exists, and a `## Documentation` section that links into
`docs/`. Every relative link target exists in the tree at HEAD.

## What CLAUDE.md keeps

There is no `CLAUDE.md` in the repository and this unit does not create one.

## Other files

- `docs/utilities.md` is untouched (already clean, 5 lines).
- No `CHANGELOG.md` exists; none is created. The PR itself records the move.
- No source, test, config or workflow file changes.

## Constraints (from the unit contract)

- Pure move: every changed path is a doc, and every non-heading body line of
  README at the base tip still exists in some doc at HEAD.
  `autodev-docs-check --preserves origin/main..HEAD` must exit 0 before every
  push.
- Every touched file must be clean under the docs gate
  (`autodev-docs-check` default mode exits 0).
- `autodev-docs-check --all` must be clean at HEAD (acceptance).
- `npm test` and `npm run lint` keep passing (they do not read docs, but the
  PR gate runs them).

## Out of scope

- Editing note wording, renumbering or de-duplicating notes.
- Restructuring `docs/utilities.md`.
- Any `docs_long_ok` exemption (owner's decision; not needed here).
