function slugify(str) {
  if (typeof str !== 'string') throw new TypeError('slugify: expected a string');
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
module.exports = { slugify };
