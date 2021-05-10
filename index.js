const debug = require('debug')('metalsmith-external-links');
const match = require('minimatch');
const cheerio = require('cheerio');


/**
 * Expose `plugin`.
 */

module.exports = plugin;


/**
 * Metalsmith plugin that renames a glob of files using string interpolation
 * patterns and file metadata or function.
 *
 * @param {Object|Array} options
 *   @property {String} pattern
 *   @property {String|Function} filename
 *   @property {Boolean} copy
 *   @property {String} date
 * @return {Function}
 */

function plugin(options) {
  options = normalize(options);
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      debug('checking file: ' + file);
      if (match(file, '**/*.html')) {
        debug('processing file: ' + file);
        files[file].contents = process(file, files[file], options)
      }
    });

    done();
  };
}

function process(filename, data, opts) {
  const $ = cheerio.load(data.contents.toString());
  const links = $('a').filter(function() {
    return isExternal($(this), opts);
  });

  if (opts.overwrite && opts.rel !== undefined) {
    links.attr('rel', opts.rel);
  }

  if (opts.overwrite && opts.target !== undefined) {
    links.attr('target', opts.target);
  }

  if (opts.overwrite && opts.extClass !== undefined) {
    links.addClass(opts.extClass);
  }

  return Buffer.from($.html(),'utf8');
}

function isExternal(link, opts) {
  const href = link.attr('href');
  const pat = 'http*://*' + opts.domain + '/**/*';
  
  if (href.indexOf('http') === -1 || match(href, pat)) {
    return false;
  }

  for(let i = 0; i < opts.whitelist.length; i++) {
    if (match(href, opts.whitelist[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Normalizes options arguments
 *
 * @param {Object|Array} options
 *   @property {String} domain
 *   @property {String/Array} whitelist
 *   @property {Boolean} selector
 *   @property {String} rel
 *   @property {String} target
 *   @property {String} extClass
 * @return {Array} patterns
 */

function normalize(options) {
  const def = {
    domain: undefined,
    whitelist: [],
    rel: 'external',
    target: '_blank',
    extClass: 'external',
    overwrite: true
  };

  if (options.domain === undefined) {
    throw Error('`domain` options is required');
  }

  return Object.assign({}, def, options);
}
