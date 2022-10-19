:hocho:
`js-hash`
==

<p align="center">
<a href="https://xkcd.com/1286">
<img src="https://imgs.xkcd.com/comics/encryptic.png" width="432"/>
</a><br/>
© <a href="https://xkcd.com">xkcd.com</a>
</p>

Hashing algorithms for JavaScript.

```js
import {alloc} from '@array-like/alloc';
import * as ascii from '@codec-bytes/ascii';
import * as base16 from '@codec-bytes/base16';
import {sha512} from '@string-hashing/sha2';
const string = 'The quick brown fox jumps over the lazy dog';
const bytes = ascii.encode(string);
const digest = sha512(bytes, bytes.length * 8, alloc(64));
digest; // [0x07, 0xe5, 0x47, 0xd9, 0x58, 0x6f, 0x6a, 0x73, 0xf7, 0x3f, ...]
base16.decode(digest); // '07E547D9586F6A73F73FBAC0435ED76951218FB7D0C8D788A309D785436B...'
```


## :deciduous_tree: Hierarchy

### :oden: String hashing

  - [`@string-hashing/sha2`](https://github.com/string-hashing/sha2)
  - [`@string-hashing/sha1`](https://github.com/string-hashing/sha1)
  - [`@string-hashing/md5`](https://github.com/string-hashing/md5)
