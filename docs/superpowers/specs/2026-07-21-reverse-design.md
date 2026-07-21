# reverse(str) utility — design

**Issue:** #3 · **Date:** 2026-07-21

## Goal

Add a `reverse(str)` utility to `src/`, matching the style of the existing
`math.js` / `slugify.js` utilities (CommonJS, named export, guard clause).

## Design

`src/reverse.js`:

- `reverse(str)` — throws `TypeError('reverse: expected a string')` for any
  non-string input (mirrors `slugify`'s guard).
- Reverses by Unicode code point: `Array.from(str).reverse().join('')`.
  Chosen over `str.split('')` (which corrupts surrogate pairs, e.g. emoji)
  at identical complexity. Grapheme-cluster reversal (`Intl.Segmenter`) was
  considered and rejected as unnecessary for this sandbox utility.
- Exported as `module.exports = { reverse }`.

## Tests

`test/reverse.test.js` using node:test + node:assert, in the style of
`test/slugify.test.js`:

- normal string (`'abc'` → `'cba'`)
- empty string (`''` → `''`)
- single character (identity)
- surrogate pair preserved (e.g. `'a💡b'` → `'b💡a'`)
- `TypeError` for each of `null`, `undefined`, `42`, `{}`, `[]`

## Scope / constraints

- No new dependencies. No changes outside `src/`, `test/`, `docs/`.
- Root `README.md` is out of scope per the issue's constraints; no other
  existing docs reference the utility list, so the docs pass adds nothing
  beyond this spec and the plan.
- Well under `max_pr_size: 1500`.
