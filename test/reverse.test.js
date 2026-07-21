const { test } = require('node:test');
const assert = require('node:assert');
const { reverse } = require('../src/reverse.js');

test('reverses a normal string', () => { assert.strictEqual(reverse('abc'), 'cba'); });
test('empty string', () => { assert.strictEqual(reverse(''), ''); });
test('single character', () => { assert.strictEqual(reverse('x'), 'x'); });
test('preserves surrogate pairs', () => { assert.strictEqual(reverse('a\u{1F4A1}b'), 'b\u{1F4A1}a'); });
test('throws TypeError on non-string', () => {
  for (const bad of [null, undefined, 42, {}, []]) {
    assert.throws(() => reverse(bad), TypeError);
  }
});
