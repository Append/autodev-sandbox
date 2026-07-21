# slugify(str) Utility — Design

**Issue:** #1 · **Date:** 2026-07-20

## Purpose

Add a `slugify(str)` utility to `src/` that converts arbitrary strings into
URL-safe slugs, matching the existing CommonJS style of `src/math.js`.

## Requirements (from issue #1)

- New file `src/slugify.js` exporting `slugify(str)` via `module.exports`.
- Non-string input throws `TypeError`.
- Transformation: lowercase; trim; runs of whitespace and underscores become a
  single `-`; all characters except `a-z`, `0-9`, `-` are stripped; repeated
  `-` collapse to one; leading/trailing `-` are stripped.
- Tests in `test/slugify.test.js` using `node:test` + `node:assert`, matching
  the style of `test/math.test.js`.
- No new dependencies. No changes outside `src/`, `test/`, and docs.

## Design

Single function, regex pipeline applied in order:

1. `typeof str !== 'string'` → `throw new TypeError('slugify: expected a string')`
2. Lowercase and trim.
3. Replace runs of whitespace/underscores: `/[\s_]+/g` → `-`.
4. Strip disallowed characters: `/[^a-z0-9-]/g` → `''`.
5. Collapse repeated hyphens: `/-+/g` → `-`.
6. Strip leading/trailing hyphens: `/^-+|-+$/g` → `''`.

Step ordering note: stripping (step 4) runs after separator replacement
(step 3) so that `"Foo_Bar"` → `"foo-bar"` rather than `"foobar"`; collapsing
(step 5) runs after stripping so that separators created adjacent by removed
characters (e.g. `"a -! b"`) still collapse.

Non-ASCII letters (e.g. `é`) are stripped, per the issue's "strip all
characters except a-z, 0-9, and -".

## Test cases

- `slugify("Hello World!") === "hello-world"`
- `slugify("  Foo_Bar  ") === "foo-bar"`
- `slugify("a--b") === "a-b"`
- Lowercasing: `slugify("ABC") === "abc"`
- Empty string → `""`; symbol-only string (e.g. `"!!!"`) → `""`
- Mixed separators/symbols: `slugify("a _ b!c") === "a-bc"`
- TypeError on non-string: `null`, `42`, `undefined`, `{}` each throw `TypeError`

## Out of scope

Unicode transliteration, options/configurability, CLI exposure.
