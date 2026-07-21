const { test } = require('node:test');
const assert = require('node:assert');
const { slugify } = require('../src/slugify.js');

test('basic example', () => { assert.strictEqual(slugify('Hello World!'), 'hello-world'); });
test('trims and converts underscores', () => { assert.strictEqual(slugify('  Foo_Bar  '), 'foo-bar'); });
test('collapses repeated hyphens', () => { assert.strictEqual(slugify('a--b'), 'a-b'); });
test('lowercases', () => { assert.strictEqual(slugify('ABC'), 'abc'); });
test('empty string', () => { assert.strictEqual(slugify(''), ''); });
test('symbol-only string', () => { assert.strictEqual(slugify('!!!'), ''); });
test('mixed separators and symbols', () => { assert.strictEqual(slugify('a _ b!c'), 'a-bc'); });
test('strips leading/trailing hyphens', () => { assert.strictEqual(slugify('--a--'), 'a'); });
test('throws TypeError on non-string', () => {
  for (const bad of [null, undefined, 42, {}, []]) {
    assert.throws(() => slugify(bad), TypeError);
  }
});
