var extlinks = require('../index.js');
var test = require('tape');

var Metalsmith = require('metalsmith');
var cheerio = require('cheerio');

function plugtest(options, fn) {
  Metalsmith('test/fixtures')
    .source('.')
    .destination('tmp')
    .use(extlinks(options)).build(function(err, files) {
      if(err) return console.log('err: ', err);
      fn(err, cheerio.load(files['d.html'].contents.toString()));
    });
}

test('should mark non-domain links attributes', function(t) {
  t.plan(2);
  plugtest({
    domain: 'googledevelopers.blogspot.com'
  }, function(err, $) {
    t.equal($('#wiki').attr('rel'), 'external');
    t.equal($('#wiki').attr('target'), '_blank');
  });
});

test('should pass relative links', function(t) {
  t.plan(2);
  plugtest({
    domain: 'googledevelopers.blogspot.com'
  }, function(err, $) {
    t.equal($('#absolute').attr('rel') === undefined, true);
    t.equal($('#updir').attr('rel') === undefined, true);
  });
});

test('should pass links matching whitelist attributes', function(t) {
  t.plan(3);
  plugtest({
    domain: 'googledevelopers.blogspot.com',
    whitelist: ['https://en.wikipedia.org/**/*']
  }, function(err, $) {
    t.equal($('#wiki').attr('rel') === undefined, true);
    t.equal($('#relative').attr('rel') === undefined, true);
    t.equal($('#full').attr('rel'), 'external');
  });
});

test('`rel` options', function(t) {
  t.plan(2);
  plugtest({
    domain: 'googledevelopers.blogspot.com',
    rel: 'unfollow'
  }, function(err, $) {
    t.equal($('#post').attr('rel') === undefined, true);
    t.equal($('#full').attr('rel'), 'unfollow');
  });
});

test('`target` options', function(t) {
  t.plan(2);
  plugtest({
    domain: 'googledevelopers.blogspot.com',
    target: '_parent'
  }, function(err, $) {
    t.equal($('#post').attr('target') === undefined, true);
    t.equal($('#full').attr('target'), '_parent');
  });
});

test('`extClass` options', function(t) {
  t.plan(2);
  plugtest({
    domain: 'googledevelopers.blogspot.com',
    extClass: 'is-ext'
  }, function(err, $) {
    t.equal($('#post').hasClass('is-ext'), false);
    t.equal($('#full').hasClass('is-ext'), true);
  });
});
