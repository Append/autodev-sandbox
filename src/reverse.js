function reverse(str) {
  if (typeof str !== 'string') throw new TypeError('reverse: expected a string');
  return Array.from(str).reverse().join('');
}
module.exports = { reverse };
