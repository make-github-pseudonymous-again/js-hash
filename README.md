:hocho: [@aureooms/js-hash](https://make-github-pseudonymous-again.github.io/js-hash)
==

<p align="center">
<a href="https://xkcd.com/1286">
<img src="https://imgs.xkcd.com/comics/encryptic.png" width="432"/>
</a><br/>
© <a href="https://xkcd.com">xkcd.com</a>
</p>

Hashing algorithms for JavaScript.
See [docs](https://make-github-pseudonymous-again.github.io/js-hash).
Parent is [@aureooms/js-algorithms](https://github.com/make-github-pseudonymous-again/js-algorithms).

```js
> import ascii from '@aureooms/js-codec-ascii' ;
> import { sha512 } from '@aureooms/js-hash' ;
> const string = 'The quick brown fox jumps over the lazy dog' ;
> const bytes = ascii.encode( string ) ;
> const digest = sha512( bytes, bytes.length * 8, alloc( 64 ) );
> digest ;
[0x07, 0xe5, 0x47, 0xd9, 0x58, 0x6f, 0x6a, 0x73, 0xf7, 0x3f, ...]
> import base16 from '@aureooms/js-codec-base16' ;
> base16.decode( digest ) ;
'07E547D9586F6A73F73FBAC0435ED76951218FB7D0C8D788A309D785436B...'
```

[![License](https://img.shields.io/github/license/make-github-pseudonymous-again/js-hash.svg)](https://raw.githubusercontent.com/make-github-pseudonymous-again/js-hash/main/LICENSE)
[![Version](https://img.shields.io/npm/v/@aureooms/js-hash.svg)](https://www.npmjs.org/package/@aureooms/js-hash)
[![Build](https://img.shields.io/travis/make-github-pseudonymous-again/js-hash/main.svg)](https://travis-ci.org/make-github-pseudonymous-again/js-hash/branches)
[![Dependencies](https://img.shields.io/david/make-github-pseudonymous-again/js-hash.svg)](https://david-dm.org/make-github-pseudonymous-again/js-hash)
[![Dev dependencies](https://img.shields.io/david/dev/make-github-pseudonymous-again/js-hash.svg)](https://david-dm.org/make-github-pseudonymous-again/js-hash?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/make-github-pseudonymous-again/js-hash.svg)](https://github.com/make-github-pseudonymous-again/js-hash/issues)
[![Downloads](https://img.shields.io/npm/dm/@aureooms/js-hash.svg)](https://www.npmjs.org/package/@aureooms/js-hash)

[![Code issues](https://img.shields.io/codeclimate/issues/make-github-pseudonymous-again/js-hash.svg)](https://codeclimate.com/github/make-github-pseudonymous-again/js-hash/issues)
[![Code maintainability](https://img.shields.io/codeclimate/maintainability/make-github-pseudonymous-again/js-hash.svg)](https://codeclimate.com/github/make-github-pseudonymous-again/js-hash/trends/churn)
[![Code coverage (cov)](https://img.shields.io/codecov/c/gh/make-github-pseudonymous-again/js-hash/main.svg)](https://codecov.io/gh/make-github-pseudonymous-again/js-hash)
[![Code technical debt](https://img.shields.io/codeclimate/tech-debt/make-github-pseudonymous-again/js-hash.svg)](https://codeclimate.com/github/make-github-pseudonymous-again/js-hash/trends/technical_debt)
[![Documentation](https://make-github-pseudonymous-again.github.io/js-hash/badge.svg)](https://make-github-pseudonymous-again.github.io/js-hash/source.html)
[![Package size](https://img.shields.io/bundlephobia/minzip/@aureooms/js-hash)](https://bundlephobia.com/result?p=@aureooms/js-hash)
