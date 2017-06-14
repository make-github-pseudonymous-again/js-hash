[@aureooms/js-hash](https://aureooms.github.io/js-hash)
==

Hashing algorithms for JavaScript.
See [docs](https://aureooms.github.io/js-hash).
Parent is [@aureooms/js-algorithms](https://github.com/aureooms/js-algorithms).

```js
const string = 'The quick brown fox jumps over the lazy dog' ;
const ascii = s => list( map( c => c.charCodeAt( 0 ) , s ) ) ;
const digest = sha512( ascii( string ), string.length * 8, alloc( 64 ) );
digest; // [0x07, 0xe5, 0x47, 0xd9, 0x58, 0x6f, 0x6a, 0x73, 0xf7, 0x3f, ...]
```

[![License](https://img.shields.io/github/license/aureooms/js-hash.svg?style=flat)](https://raw.githubusercontent.com/aureooms/js-hash/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/@aureooms/js-hash.svg?style=flat)](https://www.npmjs.org/package/@aureooms/js-hash)
[![Build Status](https://img.shields.io/travis/aureooms/js-hash.svg?style=flat)](https://travis-ci.org/aureooms/js-hash)
[![Coverage Status](https://img.shields.io/coveralls/aureooms/js-hash.svg?style=flat)](https://coveralls.io/r/aureooms/js-hash)
[![Dependencies Status](https://img.shields.io/david/aureooms/js-hash.svg?style=flat)](https://david-dm.org/aureooms/js-hash#info=dependencies)
[![devDependencies Status](https://img.shields.io/david/dev/aureooms/js-hash.svg?style=flat)](https://david-dm.org/aureooms/js-hash#info=devDependencies)
[![Code Climate](https://img.shields.io/codeclimate/github/aureooms/js-hash.svg?style=flat)](https://codeclimate.com/github/aureooms/js-hash)
[![NPM downloads per month](https://img.shields.io/npm/dm/@aureooms/js-hash.svg?style=flat)](https://www.npmjs.org/package/@aureooms/js-hash)
[![GitHub issues](https://img.shields.io/github/issues/aureooms/js-hash.svg?style=flat)](https://github.com/aureooms/js-hash/issues)
[![Documentation](https://aureooms.github.io/js-hash/badge.svg)](https://aureooms.github.io/js-hash/source.html)
