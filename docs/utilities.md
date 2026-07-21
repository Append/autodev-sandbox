# Utilities

- `src/math.js` — `add(a, b)`, `mul(a, b)`.
- `src/slugify.js` — `slugify(str)`: lowercase, trim, whitespace/underscore runs to `-`, strip non `[a-z0-9-]`, collapse and trim `-`. Throws `TypeError` on non-string input.
- `src/reverse.js` — `reverse(str)`: reverses the string by Unicode code point. Throws `TypeError` on non-string input.
