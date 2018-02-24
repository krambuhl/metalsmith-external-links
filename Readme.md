# metalsmith-external-links

Processes HTML pages using [Cheerio](https://github.com/cheeriojs/cheerio) and modifies external facing link attributes. 

## Installation

    $ npm install metalsmith-external-links --save-dev

## Javascript Usage

Pass with options to `Metalsmith#use`:

```js
var extlinks = require('metalsmith-external-links');

metalsmith.use(extlinks({
  domain: 'google.com'
  whitelist: [],
  rel: 'external',
  target: '_blank',
  extClass: 'external'
}));
```

## Options

There are a couple options available to make external links more useful.

#### domain <String> (required)

A string containing the domain name (name.ca) without protocol and `www`.  __Example__: `npmjs.com`.

#### whitelist <String/Array>

A glob string or list of glob strings used to match urls.

#### rel <String>

String used to change element `rel` attribute, leaves `rel` unchanged if set to `undefined`.

#### target <String>

String used to change element `target` attribute, leaves `target` unchanged if set to `undefined`.

#### extClass <String>

Class added to element when it's external, will leave `class` unchanged if set to `undefined`.

#### appendRel <Boolean>

If `true`, will union the `rel` values to the existing element's `rel` values. Example: Avoid clobbering a social link with `rel="publisher noopener"` when `opts.rel` is `'noopener'`.

## License

MIT