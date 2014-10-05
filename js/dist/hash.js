(function(exports, undefined){

	'use strict';


/* js/src/000-uint32 */
/* js/src/000-uint32/add32.js */

var add32 = function (a, b) {
	return (a + b) & 0xffffffff;
};

exports.add32 = add32;

/* js/src/000-uint32/big32.js */

var big32 = function big32 (a, o) {
	return (a[o + 0] << 24) | (a[o + 1] << 16) | (a[o + 2] << 8) | a[o + 3];
}

exports.big32 = big32;

/* js/src/000-uint32/lil32.js */

var lil32 = function lil32 (a, o) {
	return (a[o + 3] << 24) | (a[o + 2] << 16) | (a[o + 1] << 8) | a[o + 0];
};

exports.lil32 = lil32;

/* js/src/000-uint32/rot32.js */

/**
 * Left rotate for 32-bit unsigned integers
 *
 *  - used in md5 and sha1
 */

var rot32 = function (word, shift) {
	return (word << shift) | (word >>> (32 - shift));
};

exports.rot32 = rot32;

/* js/src/001-uint64 */
/* js/src/001-uint64/add64.js */

var add64 = function (a, b) {
	var t, u, c;

	t = (a[1] >>> 0) + (b[1] >>> 0);
	u = t & 0xffffffff;
	c = +(t > 0xffffffff);

	return [(a[0] + b[0] + c) & 0xffffffff, u];
};

exports.add64 = add64;

/* js/src/001-uint64/and64.js */

var and64 = function (a, b) {
	return [a[0] & b[0], a[1] & b[1]];
};

exports.and64 = and64;

/* js/src/001-uint64/big64.js */

var big64 = function (a, o) {
	return [
		(a[o + 0] << 24) | (a[o + 1] << 16) | (a[o + 2] << 8) | a[o + 3],
		(a[o + 4] << 24) | (a[o + 5] << 16) | (a[o + 6] << 8) | a[o + 7]
	];
};

exports.big64 = big64;

/* js/src/001-uint64/not64.js */

var not64 = function (a) {
	return [~a[0], ~a[1]];
};

exports.not64 = not64;

/* js/src/001-uint64/rot64.js */

/**
 * Right rotate for 64-bit unsigned integers
 *
 *  - used in the sha2 family
 */

var rot64 = function (a, s) {
	if (s < 32) {
		return [(a[1] << (32-s)) | a[0] >>> s, (a[0] << (32-s)) | (a[1] >>> s)];
	}
	else {
		s -= 32;
		return [(a[0] << (32-s)) | (a[1] >>> s), (a[1] << (32-s)) | a[0] >>> s];
	}
};

exports.rot64 = rot64;

/* js/src/001-uint64/sh64.js */

var sh64 = function (a, s) {
	return [a[0] >>> s, (a[0] << (32-s)) | (a[1] >>> s)];
};

exports.sh64 = sh64;

/* js/src/001-uint64/xor64.js */

var xor64 = function xor64 (a, b) {
	return [a[0] ^ b[0], a[1] ^ b[1]];
};

exports.xor64 = xor64;

/* js/src/002-hash */
/* js/src/002-hash/md5.js */


/**
 * MD5
 */

var md5 = function (bytes, n, digest) {

	var k, r, h, last, z, zeroes, j, m, o, q, y, tail, u;

	function cycle (h, k, r, w) {

		var i, f, g, a, b, c, d, t;

		// initialize hash value for this chunk:
		a = h[0];
		b = h[1];
		c = h[2];
		d = h[3];

		// main loop
		for (i = 0; i < 64; ++i) {

			if (i < 16) {
				f = (b & c) | ((~ b) & d);
				g = i;
			}
			else if (i < 32) {
				f = (d & b) | ((~ d) & c);
				g = (5 * i + 1) % 16;
			}
			else if (i < 48) {
				f = b ^ c ^ d;
				g = (3 * i + 5) % 16;
			}
			else {
				f = c ^ (b | (~ d));
				g = (7 * i) % 16;
			}


			t = d;
			d = c;
			c = b;
			b = add32(b, rot32(add32(add32(a, f), add32(k[i], w[g])) , r[i]));
			a = t;
		}

		// Add this chunk's hash to result so far:
		h[0] = add32(h[0], a);
		h[1] = add32(h[1], b);
		h[2] = add32(h[2], c);
		h[3] = add32(h[3], d);
	}

	function call (h, k, r, data, o) {

		var w;

		//break chunk into sixteen 32-bit little-endian words w[i], 0 ≤ i ≤ 15


		w = [
			lil32(data, o +  0),
			lil32(data, o +  4),
			lil32(data, o +  8),
			lil32(data, o + 12),
			lil32(data, o + 16),
			lil32(data, o + 20),
			lil32(data, o + 24),
			lil32(data, o + 28),
			lil32(data, o + 32),
			lil32(data, o + 36),
			lil32(data, o + 40),
			lil32(data, o + 44),
			lil32(data, o + 48),
			lil32(data, o + 52),
			lil32(data, o + 56),
			lil32(data, o + 60)
		];


		cycle(h, k, r, w);
	}

	k = [
		0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee ,
		0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501 ,
		0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be ,
		0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821 ,
		0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa ,
		0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8 ,
		0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed ,
		0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a ,
		0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c ,
		0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70 ,
		0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05 ,
		0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665 ,
		0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039 ,
		0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1 ,
		0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1 ,
		0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
	];

	r = [
		7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
		5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
		4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
		6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
	];


	// PREPARE

	q = n / 8 | 0;
	z = q * 8;
	u = n - z;

	// append the bit '1' to the message
	if (u > 0) {
		last = bytes[q] & (~0) << (7-u);
	}
	else {
		last = 0x80;
	}



	// initialize state
	h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

	// Process the message in successive 512-bit chunks:
	// break message into 512-bit chunks

	m = n / 512 | 0;
	y = (n - 512 * m) / 8 | 0;

	// offset in data
	o = 0;

	// for each chunk
	for (j = 0; j < m; ++j, o += 64) {
		call(h, k, r, bytes, o);
	}

	// last bytes + padding + length
	tail = [];

	// last bytes
	for (j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	// special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	tail.push(last);


	// append 0 ≤ k < 512 bits '0', so that the resulting
	// message length (in bits) is congruent to 448 (mod 512)
	zeroes = (448 - (n + 1) % 512) / 8 | 0;

	if (zeroes < 0) {
		// we need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		call(h, k, r, tail, 0);

		zeroes = 448 / 8;
		tail = [];
	}


	// pad with zeroes
	for (j = 0; j < zeroes; ++j) {
		tail.push(0);
	}

	// append length of message (before preparation), in bits,
	// as 64-bit little-endian integer

	tail.push((n >>>  0) & 0xFF);
	tail.push((n >>>  8) & 0xFF);
	tail.push((n >>> 16) & 0xFF);
	tail.push((n >>> 24) & 0xFF);
	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 32) & 0xFF);
	// tail.push((n >>> 40) & 0xFF);
	// tail.push((n >>> 48) & 0xFF);
	// tail.push((n >>> 56) & 0xFF);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);

	call(h, k, r, tail, 0);

	digest[0]  = (h[0] >>>  0) & 0xFF;
	digest[1]  = (h[0] >>>  8) & 0xFF;
	digest[2]  = (h[0] >>> 16) & 0xFF;
	digest[3]  = (h[0] >>> 24) & 0xFF;
	digest[4]  = (h[1] >>>  0) & 0xFF;
	digest[5]  = (h[1] >>>  8) & 0xFF;
	digest[6]  = (h[1] >>> 16) & 0xFF;
	digest[7]  = (h[1] >>> 24) & 0xFF;
	digest[8]  = (h[2] >>>  0) & 0xFF;
	digest[9]  = (h[2] >>>  8) & 0xFF;
	digest[10] = (h[2] >>> 16) & 0xFF;
	digest[11] = (h[2] >>> 24) & 0xFF;
	digest[12] = (h[3] >>>  0) & 0xFF;
	digest[13] = (h[3] >>>  8) & 0xFF;
	digest[14] = (h[3] >>> 16) & 0xFF;
	digest[15] = (h[3] >>> 24) & 0xFF;

	return digest;

};

exports.md5 = md5;

/* js/src/002-hash/md5fast.js */


/**
 * MD5 inlined implementation
 */

var md5fast = function (bytes, n, digest) {

	var h, len, last, z, zeroes, j, m, o, q, y, tail, u;

	function cycle(x, k) {
		var a = x[0], b = x[1], c = x[2], d = x[3];

		a = ff(a, b, c, d, k[0], 7, -680876936);
		d = ff(d, a, b, c, k[1], 12, -389564586);
		c = ff(c, d, a, b, k[2], 17,  606105819);
		b = ff(b, c, d, a, k[3], 22, -1044525330);
		a = ff(a, b, c, d, k[4], 7, -176418897);
		d = ff(d, a, b, c, k[5], 12,  1200080426);
		c = ff(c, d, a, b, k[6], 17, -1473231341);
		b = ff(b, c, d, a, k[7], 22, -45705983);
		a = ff(a, b, c, d, k[8], 7,  1770035416);
		d = ff(d, a, b, c, k[9], 12, -1958414417);
		c = ff(c, d, a, b, k[10], 17, -42063);
		b = ff(b, c, d, a, k[11], 22, -1990404162);
		a = ff(a, b, c, d, k[12], 7,  1804603682);
		d = ff(d, a, b, c, k[13], 12, -40341101);
		c = ff(c, d, a, b, k[14], 17, -1502002290);
		b = ff(b, c, d, a, k[15], 22,  1236535329);

		a = gg(a, b, c, d, k[1], 5, -165796510);
		d = gg(d, a, b, c, k[6], 9, -1069501632);
		c = gg(c, d, a, b, k[11], 14,  643717713);
		b = gg(b, c, d, a, k[0], 20, -373897302);
		a = gg(a, b, c, d, k[5], 5, -701558691);
		d = gg(d, a, b, c, k[10], 9,  38016083);
		c = gg(c, d, a, b, k[15], 14, -660478335);
		b = gg(b, c, d, a, k[4], 20, -405537848);
		a = gg(a, b, c, d, k[9], 5,  568446438);
		d = gg(d, a, b, c, k[14], 9, -1019803690);
		c = gg(c, d, a, b, k[3], 14, -187363961);
		b = gg(b, c, d, a, k[8], 20,  1163531501);
		a = gg(a, b, c, d, k[13], 5, -1444681467);
		d = gg(d, a, b, c, k[2], 9, -51403784);
		c = gg(c, d, a, b, k[7], 14,  1735328473);
		b = gg(b, c, d, a, k[12], 20, -1926607734);

		a = hh(a, b, c, d, k[5], 4, -378558);
		d = hh(d, a, b, c, k[8], 11, -2022574463);
		c = hh(c, d, a, b, k[11], 16,  1839030562);
		b = hh(b, c, d, a, k[14], 23, -35309556);
		a = hh(a, b, c, d, k[1], 4, -1530992060);
		d = hh(d, a, b, c, k[4], 11,  1272893353);
		c = hh(c, d, a, b, k[7], 16, -155497632);
		b = hh(b, c, d, a, k[10], 23, -1094730640);
		a = hh(a, b, c, d, k[13], 4,  681279174);
		d = hh(d, a, b, c, k[0], 11, -358537222);
		c = hh(c, d, a, b, k[3], 16, -722521979);
		b = hh(b, c, d, a, k[6], 23,  76029189);
		a = hh(a, b, c, d, k[9], 4, -640364487);
		d = hh(d, a, b, c, k[12], 11, -421815835);
		c = hh(c, d, a, b, k[15], 16,  530742520);
		b = hh(b, c, d, a, k[2], 23, -995338651);

		a = ii(a, b, c, d, k[0], 6, -198630844);
		d = ii(d, a, b, c, k[7], 10,  1126891415);
		c = ii(c, d, a, b, k[14], 15, -1416354905);
		b = ii(b, c, d, a, k[5], 21, -57434055);
		a = ii(a, b, c, d, k[12], 6,  1700485571);
		d = ii(d, a, b, c, k[3], 10, -1894986606);
		c = ii(c, d, a, b, k[10], 15, -1051523);
		b = ii(b, c, d, a, k[1], 21, -2054922799);
		a = ii(a, b, c, d, k[8], 6,  1873313359);
		d = ii(d, a, b, c, k[15], 10, -30611744);
		c = ii(c, d, a, b, k[6], 15, -1560198380);
		b = ii(b, c, d, a, k[13], 21,  1309151649);
		a = ii(a, b, c, d, k[4], 6, -145523070);
		d = ii(d, a, b, c, k[11], 10, -1120210379);
		c = ii(c, d, a, b, k[2], 15,  718787259);
		b = ii(b, c, d, a, k[9], 21, -343485551);

		x[0] = add32(a, x[0]);
		x[1] = add32(b, x[1]);
		x[2] = add32(c, x[2]);
		x[3] = add32(d, x[3]);

	}

	function cmn(q, a, b, x, s, t) {
		a = add32(add32(a, q), add32(x, t));
		return add32((a << s) | (a >>> (32 - s)), b);
	}

	function ff(a, b, c, d, x, s, t) {
		return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}

	function gg(a, b, c, d, x, s, t) {
		return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}

	function hh(a, b, c, d, x, s, t) {
		return cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function ii(a, b, c, d, x, s, t) {
		return cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	function call (h, data, o) {

		var w;

		//break chunk into sixteen 32-bit little-endian words w[i], 0 ≤ i ≤ 15

		w = [
			lil32(data, o +  0),
			lil32(data, o +  4),
			lil32(data, o +  8),
			lil32(data, o + 12),
			lil32(data, o + 16),
			lil32(data, o + 20),
			lil32(data, o + 24),
			lil32(data, o + 28),
			lil32(data, o + 32),
			lil32(data, o + 36),
			lil32(data, o + 40),
			lil32(data, o + 44),
			lil32(data, o + 48),
			lil32(data, o + 52),
			lil32(data, o + 56),
			lil32(data, o + 60)
		];

		cycle(h, w);
	}


	// PREPARE

	q = n / 8 | 0;
	z = q * 8;
	u = n - z;

	// append the bit '1' to the message
	if (u > 0) {
		last = bytes[q] & (~0) << (7-u);
	}
	else {
		last = 0x80;
	}

	// initialize state
	h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

	// Process the message in successive 512-bit chunks:
	// break message into 512-bit chunks

	m = n / 512 | 0;
	y = (n - 512 * m) / 8 | 0;

	// for each chunk
	o = 0;

	for (j = 0; j < m; ++j, o += 64) {
		call(h, bytes, o);
	}

	tail = [];

	for (j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	tail.push(last);

	// append 0 ≤ k < 512 bits '0', so that the resulting
	// message length (in bits) is congruent to 448 (mod 512)
	zeroes = (448 - (n + 1) % 512) / 8 | 0;

	if (zeroes < 0) {
		for (j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 448 / 8;
		tail = [];
	}


	for (j = 0; j < zeroes; ++j) {
		tail.push(0);
	}

	// append length of message (before preparation), in bits,
	// as 64-bit little-endian integer

	tail.push((n >>>  0) & 0xFF);
	tail.push((n >>>  8) & 0xFF);
	tail.push((n >>> 16) & 0xFF);
	tail.push((n >>> 24) & 0xFF);
	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 32) & 0xFF);
	// tail.push((n >>> 40) & 0xFF);
	// tail.push((n >>> 48) & 0xFF);
	// tail.push((n >>> 56) & 0xFF);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);

	call(h, tail, 0);

	digest[0]  = (h[0] >>>  0) & 0xFF;
	digest[1]  = (h[0] >>>  8) & 0xFF;
	digest[2]  = (h[0] >>> 16) & 0xFF;
	digest[3]  = (h[0] >>> 24) & 0xFF;
	digest[4]  = (h[1] >>>  0) & 0xFF;
	digest[5]  = (h[1] >>>  8) & 0xFF;
	digest[6]  = (h[1] >>> 16) & 0xFF;
	digest[7]  = (h[1] >>> 24) & 0xFF;
	digest[8]  = (h[2] >>>  0) & 0xFF;
	digest[9]  = (h[2] >>>  8) & 0xFF;
	digest[10] = (h[2] >>> 16) & 0xFF;
	digest[11] = (h[2] >>> 24) & 0xFF;
	digest[12] = (h[3] >>>  0) & 0xFF;
	digest[13] = (h[3] >>>  8) & 0xFF;
	digest[14] = (h[3] >>> 16) & 0xFF;
	digest[15] = (h[3] >>> 24) & 0xFF;

	return digest;

};

exports.md5fast = md5fast;

/* js/src/002-hash/sha1.js */


/**
 * SHA1
 */

var sha1 = function (bytes, n, digest) {

	var q, z, u, last, h, m, y, o, j, tail, zeroes;

	function cycle (h, w) {

		var j, f, k, a, b, c, d, e, t;

		// initialize hash value for this chunk:
		a = h[0];
		b = h[1];
		c = h[2];
		d = h[3];
		e = h[4];

		// Main loop:[35]
		// for j from 0 to 79
		for (j = 0; j < 80; ++j) {

			// if 0 ≤ j ≤ 19 then
			if(0 <= j && j <= 19){
				// f = (b and c) or ((not b) and d)
				f = (b & c) | ((~ b) & d);
				k = 0x5A827999;
			}
			// else if 20 ≤ j ≤ 39
			else if(20 <= j && j <= 39){
				// f = b xor c xor d
				f = b ^ c ^ d;
				k = 0x6ED9EBA1;
			}
			// else if 40 ≤ j ≤ 59
			else if(40 <= j && j <= 59){
				// f = (b and c) or (b and d) or (c and d)
				f = (b & c) | (b & d) | (c & d);
				k = 0x8F1BBCDC;
			}
			// else if 60 ≤ j ≤ 79
			else{
				// f = b xor c xor d
				f = b ^ c ^ d;
				k = 0xCA62C1D6;
			}

			// t = (a leftrotate 5) + f + e + k + w[j]
			t = add32(add32(rot32(a, 5), f), add32(add32(e, k), w[j]));
			e = d;
			d = c;
			// c = b leftrotate 30
			c = rot32(b, 30);
			b = a;
			a = t;
		}

		// Add this chunk's hash to result so far:
		h[0] = add32(h[0], a);
		h[1] = add32(h[1], b);
		h[2] = add32(h[2], c);
		h[3] = add32(h[3], d);
		h[4] = add32(h[4], e);
	}

	function call (h, data, o) {

		var w, j, k;


		w = new Array(80);

		// break chunk into sixteen 32-bit big-endian words w[i], 0 ≤ i ≤ 15
		for (j = 0; j < 16; ++j) {
			w[j] = big32(data, o + j * 4);
		}

		// Extend the sixteen 32-bit words into eighty 32-bit words:
		// for j from 16 to 79
		for(j = 16; j < 80; ++j){
			// w[j] = (w[j-3] xor w[j-8] xor w[j-14] xor w[j-16]) leftrotate 1
			k = (w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16]);
			w[j] = rot32(k, 1);
		}


		cycle(h, w);
	}


	// PREPARE

	q = n / 8 | 0;
	z = q * 8;
	u = n - z;

	// append the bit '1' to the message
	if (u > 0) {
		last = bytes[q] & (~0) << (7-u);
	}
	else {
		last = 0x80;
	}



	// Note 1: All variables are unsigned 32 bits and wrap modulo 2^32 when calculating
	// Note 2: All constants in this pseudo code are in big endian.
	// Within each word, the most significant byte is stored in the leftmost byte position

	// Initialize state:
	h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];

	// Process the message in successive 512-bit chunks:
	// break message into 512-bit chunks

	m = n / 512 | 0;
	y = (n - 512 * m) / 8 | 0;

	// offset in data
	o = 0;

	// for each chunk
	for (j = 0; j < m; ++j, o += 64) {
		call(h, bytes, o);
	}

	// last bytes + padding + length
	tail = [];

	// last bytes
	for (j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	// special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	tail.push(last);


	// append 0 ≤ k < 512 bits '0', so that the resulting
	// message length (in bits) is congruent to 448 (mod 512)
	zeroes = (448 - (n + 1) % 512) / 8 | 0;

	if (zeroes < 0) {
		// we need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 448 / 8;
		tail = [];
	}


	// pad with zeroes
	for (j = 0; j < zeroes; ++j) {
		tail.push(0);
	}

	// append length of message (before preparation), in bits,
	// as 64-bit big-endian integer

	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 56) & 0xFF);
	// tail.push((n >>> 48) & 0xFF);
	// tail.push((n >>> 40) & 0xFF);
	// tail.push((n >>> 32) & 0xFF);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);

	tail.push((n >>> 24) & 0xFF);
	tail.push((n >>> 16) & 0xFF);
	tail.push((n >>>  8) & 0xFF);
	tail.push((n >>>  0) & 0xFF);

	call(h, tail, 0);

	digest[0]  = (h[0] >>> 24) & 0xFF;
	digest[1]  = (h[0] >>> 16) & 0xFF;
	digest[2]  = (h[0] >>>  8) & 0xFF;
	digest[3]  = (h[0] >>>  0) & 0xFF;
	digest[4]  = (h[1] >>> 24) & 0xFF;
	digest[5]  = (h[1] >>> 16) & 0xFF;
	digest[6]  = (h[1] >>>  8) & 0xFF;
	digest[7]  = (h[1] >>>  0) & 0xFF;
	digest[8]  = (h[2] >>> 24) & 0xFF;
	digest[9]  = (h[2] >>> 16) & 0xFF;
	digest[10] = (h[2] >>>  8) & 0xFF;
	digest[11] = (h[2] >>>  0) & 0xFF;
	digest[12] = (h[3] >>> 24) & 0xFF;
	digest[13] = (h[3] >>> 16) & 0xFF;
	digest[14] = (h[3] >>>  8) & 0xFF;
	digest[15] = (h[3] >>>  0) & 0xFF;
	digest[16] = (h[4] >>> 24) & 0xFF;
	digest[17] = (h[4] >>> 16) & 0xFF;
	digest[18] = (h[4] >>>  8) & 0xFF;
	digest[19] = (h[4] >>>  0) & 0xFF;

	return digest;
};

exports.sha1 = sha1;

/* js/src/002-hash/sha224.js */


/**
 * SHA-224
 * 
 * SHA-224 is identical to SHA-256, except that:
 *  - the initial variable values h0 through h7 are different, and
 *  - the output is constructed by omitting h7.
 */

var sha224 = function (bytes, n, digest) {
	var q, z, u, last, h, m, y, o, j, tail, zeroes, k;

	k = [
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	];

	function add32 (a, b) {
		return (a + b) & 0xffffffff;
	}

	function big32 (a, o) {
		return (a[o + 0] << 24) |
		       (a[o + 1] << 16) |
		       (a[o + 2] <<  8) |
		        a[o + 3];
	}

	function cycle (state, w) {

		var j, a, b, c, d, e, f, g, h, t, s0, s1, ch, temp, maj;

		// initialize hash value for this chunk:
		a = state[0];
		b = state[1];
		c = state[2];
		d = state[3];
		e = state[4];
		f = state[5];
		g = state[6];
		h = state[7];

		//Main loop:
		//for j from 0 to 63
		for(j = 0; j < 64; ++j){
			//S1 := (e rightrotate 6) xor (e rightrotate 11) xor (e rightrotate 25)
			s1 = (e >>> 6 | e << 26) ^(e >>> 11 | e << 21) ^(e >>> 25 | e << 7);
			//ch := (e and f) xor ((not e) and g)
			ch = (e & f) ^ ((~e) & g);
			//temp := h + S1 + ch + k[j] + w[j]
			temp = add32(add32(h, s1), add32(add32(ch, k[j]), w[j]));
			//d := d + temp;
			d = add32(d, temp);
			//S0 := (a rightrotate 2) xor (a rightrotate 13) xor (a rightrotate 22)
			s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
			//maj := (a and (b xor c)) xor (b and c)
			maj = (a & (b ^ c)) ^ (b & c);
			//temp := temp + S0 + maj
			temp = add32(add32(temp, s0), maj);

			h = g;
			g = f;
			f = e;
			e = d;
			d = c;
			c = b;
			b = a;
			a = temp;
		}

		// Add this chunk's hash to result so far:
		state[0] = add32(state[0], a);
		state[1] = add32(state[1], b);
		state[2] = add32(state[2], c);
		state[3] = add32(state[3], d);
		state[4] = add32(state[4], e);
		state[5] = add32(state[5], f);
		state[6] = add32(state[6], g);
		state[7] = add32(state[7], h);
	}

	function call (h, data, o) {

		var w, j, s0, s1;

		w = new Array(64);

		// break chunk into sixteen 32-bit big-endian words w[i], 0 ≤ i ≤ 15
		for (j = 0; j < 16; ++j) {
			w[j] = big32(data, o + j * 4);
		}

		// Extend the sixteen 32-bit words into sixty-four 32-bit words:
		// for j from 16 to 63
		for (j = 16; j < 64; ++j) {
			//s0 := (w[j-15] rightrotate 7) xor (w[j-15] rightrotate 18) xor (w[j-15] rightshift 3)
			s0 = (w[j-15] >>> 7 | w[j-15] << 25) ^ (w[j-15] >>> 18 | w[j-15] << 14) ^ (w[j-15] >>> 3);
			//s1 := (w[j-2] rightrotate 17) xor (w[j-2] rightrotate 19) xor (w[j-2] rightshift 10)
			s1 = (w[j-2] >>> 17 | w[j-2] << 15) ^ (w[j-2] >>> 19 | w[j-2] << 13) ^ (w[j-2] >>> 10);
			//w[j] := w[j-16] + s0 + w[j-7] + s1
			w[j] = add32(add32(w[j-16], s0), add32(w[j-7], s1));
		}


		cycle(h, w);
	}


	// PREPARE

	q = n / 8 | 0;
	z = q * 8;
	u = n - z;

	// append the bit '1' to the message
	if (u > 0) {
		last = bytes[q] & (~0) << (7-u);
	}
	else {
		last = 0x80;
	}



	// Note 1: All variables are unsigned 32 bits and wrap modulo 2^32 when calculating
	// Note 2: All constants in this pseudo code are in big endian.
	// Within each word, the most significant byte is stored in the leftmost byte position

	// Initialize state:
	h = [0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4];

	// Process the message in successive 512-bit chunks:
	// break message into 512-bit chunks

	m = n / 512 | 0;
	y = (n - 512 * m) / 8 | 0;

	// offset in data
	o = 0;

	// for each chunk
	for (j = 0; j < m; ++j, o += 64) {
		call(h, bytes, o);
	}

	// last bytes + padding + length
	tail = [];

	// last bytes
	for (j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	// special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	tail.push(last);


	// append 0 ≤ k < 512 bits '0', so that the resulting
	// message length (in bits) is congruent to 448 (mod 512)
	zeroes = (448 - (n + 1) % 512) / 8 | 0;

	if (zeroes < 0) {
		// we need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 448 / 8;
		tail = [];
	}


	// pad with zeroes
	for (j = 0; j < zeroes; ++j) {
		tail.push(0);
	}

	// append length of message (before preparation), in bits,
	// as 64-bit big-endian integer

	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 56) & 0xff);
	// tail.push((n >>> 48) & 0xff);
	// tail.push((n >>> 40) & 0xff);
	// tail.push((n >>> 32) & 0xff);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	
	tail.push((n >>> 24) & 0xff);
	tail.push((n >>> 16) & 0xff);
	tail.push((n >>>  8) & 0xff);
	tail.push((n >>>  0) & 0xff);

	call(h, tail, 0);

	digest[0]  = (h[0] >>> 24) & 0xff;
	digest[1]  = (h[0] >>> 16) & 0xff;
	digest[2]  = (h[0] >>>  8) & 0xff;
	digest[3]  = (h[0] >>>  0) & 0xff;
	digest[4]  = (h[1] >>> 24) & 0xff;
	digest[5]  = (h[1] >>> 16) & 0xff;
	digest[6]  = (h[1] >>>  8) & 0xff;
	digest[7]  = (h[1] >>>  0) & 0xff;
	digest[8]  = (h[2] >>> 24) & 0xff;
	digest[9]  = (h[2] >>> 16) & 0xff;
	digest[10] = (h[2] >>>  8) & 0xff;
	digest[11] = (h[2] >>>  0) & 0xff;
	digest[12] = (h[3] >>> 24) & 0xff;
	digest[13] = (h[3] >>> 16) & 0xff;
	digest[14] = (h[3] >>>  8) & 0xff;
	digest[15] = (h[3] >>>  0) & 0xff;
	digest[16] = (h[4] >>> 24) & 0xff;
	digest[17] = (h[4] >>> 16) & 0xff;
	digest[18] = (h[4] >>>  8) & 0xff;
	digest[19] = (h[4] >>>  0) & 0xff;
	digest[20] = (h[5] >>> 24) & 0xff;
	digest[21] = (h[5] >>> 16) & 0xff;
	digest[22] = (h[5] >>>  8) & 0xff;
	digest[23] = (h[5] >>>  0) & 0xff;
	digest[24] = (h[6] >>> 24) & 0xff;
	digest[25] = (h[6] >>> 16) & 0xff;
	digest[26] = (h[6] >>>  8) & 0xff;
	digest[27] = (h[6] >>>  0) & 0xff;

	return digest;
};

exports.sha224 = sha224;

/* js/src/002-hash/sha256.js */


/**
 * SHA-256
 */

var sha256 = function (bytes, n, digest) {
	var q, z, u, last, h, m, y, o, j, tail, zeroes, k;

	k = [
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	];

	function add32 (a, b) {
		return (a + b) & 0xffffffff;
	}

	function big32 (a, o) {
		return (a[o + 0] << 24) |
		       (a[o + 1] << 16) |
		       (a[o + 2] <<  8) |
		        a[o + 3];
	}

	function cycle (state, w) {

		var j, a, b, c, d, e, f, g, h, t, s0, s1, ch, temp, maj;

		// initialize hash value for this chunk:
		a = state[0];
		b = state[1];
		c = state[2];
		d = state[3];
		e = state[4];
		f = state[5];
		g = state[6];
		h = state[7];

		//Main loop:
		//for j from 0 to 63
		for(j = 0; j < 64; ++j){
			//S1 := (e rightrotate 6) xor (e rightrotate 11) xor (e rightrotate 25)
			s1 = (e >>> 6 | e << 26) ^(e >>> 11 | e << 21) ^(e >>> 25 | e << 7);
			//ch := (e and f) xor ((not e) and g)
			ch = (e & f) ^ ((~e) & g);
			//temp := h + S1 + ch + k[j] + w[j]
			temp = add32(add32(h, s1), add32(add32(ch, k[j]), w[j]));
			//d := d + temp;
			d = add32(d, temp);
			//S0 := (a rightrotate 2) xor (a rightrotate 13) xor (a rightrotate 22)
			s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
			//maj := (a and (b xor c)) xor (b and c)
			maj = (a & (b ^ c)) ^ (b & c);
			//temp := temp + S0 + maj
			temp = add32(add32(temp, s0), maj);

			h = g;
			g = f;
			f = e;
			e = d;
			d = c;
			c = b;
			b = a;
			a = temp;
		}

		// Add this chunk's hash to result so far:
		state[0] = add32(state[0], a);
		state[1] = add32(state[1], b);
		state[2] = add32(state[2], c);
		state[3] = add32(state[3], d);
		state[4] = add32(state[4], e);
		state[5] = add32(state[5], f);
		state[6] = add32(state[6], g);
		state[7] = add32(state[7], h);
	}

	function call (h, data, o) {

		var w, j, s0, s1;

		w = new Array(64);

		// break chunk into sixteen 32-bit big-endian words w[i], 0 ≤ i ≤ 15
		for (j = 0; j < 16; ++j) {
			w[j] = big32(data, o + j * 4);
		}

		// Extend the sixteen 32-bit words into sixty-four 32-bit words:
		// for j from 16 to 63
		for (j = 16; j < 64; ++j) {
			//s0 := (w[j-15] rightrotate 7) xor (w[j-15] rightrotate 18) xor (w[j-15] rightshift 3)
			s0 = (w[j-15] >>> 7 | w[j-15] << 25) ^ (w[j-15] >>> 18 | w[j-15] << 14) ^ (w[j-15] >>> 3);
			//s1 := (w[j-2] rightrotate 17) xor (w[j-2] rightrotate 19) xor (w[j-2] rightshift 10)
			s1 = (w[j-2] >>> 17 | w[j-2] << 15) ^ (w[j-2] >>> 19 | w[j-2] << 13) ^ (w[j-2] >>> 10);
			//w[j] := w[j-16] + s0 + w[j-7] + s1
			w[j] = add32(add32(w[j-16], s0), add32(w[j-7], s1));
		}


		cycle(h, w);
	}


	// PREPARE

	q = n / 8 | 0;
	z = q * 8;
	u = n - z;

	// append the bit '1' to the message
	if (u > 0) {
		last = bytes[q] & (~0) << (7-u);
	}
	else {
		last = 0x80;
	}



	// Note 1: All variables are unsigned 32 bits and wrap modulo 2^32 when calculating
	// Note 2: All constants in this pseudo code are in big endian.
	// Within each word, the most significant byte is stored in the leftmost byte position

	// Initialize state:
	h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

	// Process the message in successive 512-bit chunks:
	// break message into 512-bit chunks

	m = n / 512 | 0;
	y = (n - 512 * m) / 8 | 0;

	// offset in data
	o = 0;

	// for each chunk
	for (j = 0; j < m; ++j, o += 64) {
		call(h, bytes, o);
	}

	// last bytes + padding + length
	tail = [];

	// last bytes
	for (j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	// special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	tail.push(last);


	// append 0 ≤ k < 512 bits '0', so that the resulting
	// message length (in bits) is congruent to 448 (mod 512)
	zeroes = (448 - (n + 1) % 512) / 8 | 0;

	if (zeroes < 0) {
		// we need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 448 / 8;
		tail = [];
	}


	// pad with zeroes
	for (j = 0; j < zeroes; ++j) {
		tail.push(0);
	}

	// append length of message (before preparation), in bits,
	// as 64-bit big-endian integer

	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 56) & 0xff);
	// tail.push((n >>> 48) & 0xff);
	// tail.push((n >>> 40) & 0xff);
	// tail.push((n >>> 32) & 0xff);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	
	tail.push((n >>> 24) & 0xff);
	tail.push((n >>> 16) & 0xff);
	tail.push((n >>>  8) & 0xff);
	tail.push((n >>>  0) & 0xff);

	call(h, tail, 0);

	digest[0]  = (h[0] >>> 24) & 0xff;
	digest[1]  = (h[0] >>> 16) & 0xff;
	digest[2]  = (h[0] >>>  8) & 0xff;
	digest[3]  = (h[0] >>>  0) & 0xff;
	digest[4]  = (h[1] >>> 24) & 0xff;
	digest[5]  = (h[1] >>> 16) & 0xff;
	digest[6]  = (h[1] >>>  8) & 0xff;
	digest[7]  = (h[1] >>>  0) & 0xff;
	digest[8]  = (h[2] >>> 24) & 0xff;
	digest[9]  = (h[2] >>> 16) & 0xff;
	digest[10] = (h[2] >>>  8) & 0xff;
	digest[11] = (h[2] >>>  0) & 0xff;
	digest[12] = (h[3] >>> 24) & 0xff;
	digest[13] = (h[3] >>> 16) & 0xff;
	digest[14] = (h[3] >>>  8) & 0xff;
	digest[15] = (h[3] >>>  0) & 0xff;
	digest[16] = (h[4] >>> 24) & 0xff;
	digest[17] = (h[4] >>> 16) & 0xff;
	digest[18] = (h[4] >>>  8) & 0xff;
	digest[19] = (h[4] >>>  0) & 0xff;
	digest[20] = (h[5] >>> 24) & 0xff;
	digest[21] = (h[5] >>> 16) & 0xff;
	digest[22] = (h[5] >>>  8) & 0xff;
	digest[23] = (h[5] >>>  0) & 0xff;
	digest[24] = (h[6] >>> 24) & 0xff;
	digest[25] = (h[6] >>> 16) & 0xff;
	digest[26] = (h[6] >>>  8) & 0xff;
	digest[27] = (h[6] >>>  0) & 0xff;
	digest[28] = (h[7] >>> 24) & 0xff;
	digest[29] = (h[7] >>> 16) & 0xff;
	digest[30] = (h[7] >>>  8) & 0xff;
	digest[31] = (h[7] >>>  0) & 0xff;

	return digest;
};

exports.sha256 = sha256;

/* js/src/002-hash/sha384.js */


/**
 * SHA-384
 */

var sha384 = function (bytes, n, digest) {
	var q, z, u, last, h, m, y, o, i, j, tail, zeroes, g, k;


	// Note 1: All variables are unsigned 64 bits and wrap modulo 2^64 when calculating
	// Note 2: All constants in this pseudo code are in big endian

	// Initialize variables
	// (first 64 bits of the fractional parts of the square roots of the 9th through 16th primes 23..53)
	h = [
		[0xcbbb9d5d, 0xc1059ed8],
		[0x629a292a, 0x367cd507],
		[0x9159015a, 0x3070dd17],
		[0x152fecd8, 0xf70e5939],
		[0x67332667, 0xffc00b31],
		[0x8eb44a87, 0x68581511],
		[0xdb0c2e0d, 0x64f98fa7],
		[0x47b5481d, 0xbefa4fa4]
	];

	// Initialize table of round constants
	// (first 64 bits of the fractional parts of the cube roots of the first 80 primes 2..311):
	k = [
		[0x428a2f98, 0xd728ae22], [0x71374491, 0x23ef65cd], [0xb5c0fbcf, 0xec4d3b2f], [0xe9b5dba5, 0x8189dbbc],
		[0x3956c25b, 0xf348b538], [0x59f111f1, 0xb605d019], [0x923f82a4, 0xaf194f9b], [0xab1c5ed5, 0xda6d8118],
		[0xd807aa98, 0xa3030242], [0x12835b01, 0x45706fbe], [0x243185be, 0x4ee4b28c], [0x550c7dc3, 0xd5ffb4e2],
		[0x72be5d74, 0xf27b896f], [0x80deb1fe, 0x3b1696b1], [0x9bdc06a7, 0x25c71235], [0xc19bf174, 0xcf692694],
		[0xe49b69c1, 0x9ef14ad2], [0xefbe4786, 0x384f25e3], [0x0fc19dc6, 0x8b8cd5b5], [0x240ca1cc, 0x77ac9c65],
		[0x2de92c6f, 0x592b0275], [0x4a7484aa, 0x6ea6e483], [0x5cb0a9dc, 0xbd41fbd4], [0x76f988da, 0x831153b5],
		[0x983e5152, 0xee66dfab], [0xa831c66d, 0x2db43210], [0xb00327c8, 0x98fb213f], [0xbf597fc7, 0xbeef0ee4],
		[0xc6e00bf3, 0x3da88fc2], [0xd5a79147, 0x930aa725], [0x06ca6351, 0xe003826f], [0x14292967, 0x0a0e6e70],
		[0x27b70a85, 0x46d22ffc], [0x2e1b2138, 0x5c26c926], [0x4d2c6dfc, 0x5ac42aed], [0x53380d13, 0x9d95b3df],
		[0x650a7354, 0x8baf63de], [0x766a0abb, 0x3c77b2a8], [0x81c2c92e, 0x47edaee6], [0x92722c85, 0x1482353b],
		[0xa2bfe8a1, 0x4cf10364], [0xa81a664b, 0xbc423001], [0xc24b8b70, 0xd0f89791], [0xc76c51a3, 0x0654be30],
		[0xd192e819, 0xd6ef5218], [0xd6990624, 0x5565a910], [0xf40e3585, 0x5771202a], [0x106aa070, 0x32bbd1b8],
		[0x19a4c116, 0xb8d2d0c8], [0x1e376c08, 0x5141ab53], [0x2748774c, 0xdf8eeb99], [0x34b0bcb5, 0xe19b48a8],
		[0x391c0cb3, 0xc5c95a63], [0x4ed8aa4a, 0xe3418acb], [0x5b9cca4f, 0x7763e373], [0x682e6ff3, 0xd6b2b8a3],
		[0x748f82ee, 0x5defb2fc], [0x78a5636f, 0x43172f60], [0x84c87814, 0xa1f0ab72], [0x8cc70208, 0x1a6439ec],
		[0x90befffa, 0x23631e28], [0xa4506ceb, 0xde82bde9], [0xbef9a3f7, 0xb2c67915], [0xc67178f2, 0xe372532b],
		[0xca273ece, 0xea26619c], [0xd186b8c7, 0x21c0c207], [0xeada7dd6, 0xcde0eb1e], [0xf57d4f7f, 0xee6ed178],
		[0x06f067aa, 0x72176fba], [0x0a637dc5, 0xa2c898a6], [0x113f9804, 0xbef90dae], [0x1b710b35, 0x131c471b],
		[0x28db77f5, 0x23047d84], [0x32caab7b, 0x40c72493], [0x3c9ebe0a, 0x15c9bebc], [0x431d67c4, 0x9c100d4c],
		[0x4cc5d4be, 0xcb3e42b6], [0x597f299c, 0xfc657e2a], [0x5fcb6fab, 0x3ad6faec], [0x6c44198c, 0x4a475817]
	];

	function cycle (state, w) {

		var j, a, b, c, d, e, f, g, h, t, s0, s1, ch, temp, maj;

		// initialize hash value for this chunk:
		a = state[0];
		b = state[1];
		c = state[2];
		d = state[3];
		e = state[4];
		f = state[5];
		g = state[6];
		h = state[7];

		// Main loop:
		// for j from 0 to 79
		for (j = 0; j < 80; ++j) {
			// S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
			s1 = xor64(xor64(rot64(e, 14), rot64(e, 18)), rot64(e, 41));
			// ch := (e and f) xor ((not e) and g)
			ch = xor64(and64(e, f), and64(not64(e), g));
			// temp := h + S1 + ch + k[j] + w[j]
			temp = add64(add64(h, s1), add64(add64(ch, k[j]), w[j]));
			// d := d + temp;
			d = add64(d, temp);
			// S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
			s0 = xor64(xor64(rot64(a, 28), rot64(a, 34)), rot64(a, 39));
			// maj := (a and (b xor c)) xor (b and c)
			maj = xor64(and64(a, xor64(b, c)), and64(b, c));
			// temp := temp + S0 + maj
			temp = add64(add64(temp, s0), maj);

			h = g;
			g = f;
			f = e;
			e = d;
			d = c;
			c = b;
			b = a;
			a = temp;
		}

		// Add this chunk's hash to result so far:
		state[0] = add64(state[0], a);
		state[1] = add64(state[1], b);
		state[2] = add64(state[2], c);
		state[3] = add64(state[3], d);
		state[4] = add64(state[4], e);
		state[5] = add64(state[5], f);
		state[6] = add64(state[6], g);
		state[7] = add64(state[7], h);
	}

	function call (h, data, o) {

		var w, j, s0, s1;

		w = new Array(80);

		// break chunk into sixteen 64-bit big-endian words w[i], 0 ≤ i ≤ 15
		for (j = 0; j < 16; ++j) {
			w[j] = big64(data, o + j * 8);
		}

		// Extend the sixteen 64-bit words into 80 64-bit words:
		// for j from 16 to 79
		for (j = 16; j < 80; ++j) {
			// s0 := (w[j-15] rightrotate 1) xor (w[j-15] rightrotate 8) xor (w[j-15] rightshift 7)
			s0 = xor64(xor64(rot64(w[j-15],  1), rot64(w[j-15],  8)), sh64(w[j-15], 7));
			// s1 := (w[j-2] rightrotate 19) xor (w[j-2] rightrotate 61) xor (w[j-2] rightshift 6)
			s1 = xor64(xor64(rot64(w[j- 2], 19), rot64(w[j- 2], 61)), sh64(w[j- 2], 6));
			// w[j] := w[j-16] + s0 + w[j-7] + s1
			w[j] = add64(add64(w[j-16], s0), add64(w[j-7], s1));
		}


		cycle(h, w);
	}


	// PREPARE

	q = n / 8 | 0;
	z = q * 8;
	u = n - z;

	// append the bit '1' to the message
	if (u > 0) {
		last = bytes[q] & (~0) << (7-u);
	}
	else {
		last = 0x80;
	}


	// Process the message in successive 1024-bit chunks:
	// break message into 1024-bit chunks

	m = n / 1024 | 0;
	y = (n - 1024 * m) / 8 | 0;

	// offset in data
	o = 0;

	// for each chunk
	for (j = 0; j < m; ++j, o += 128) {
		call(h, bytes, o);
	}

	// last bytes + padding + length
	tail = [];

	// last bytes
	for (j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	// special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	tail.push(last);


	// append 0 ≤ k < 1024 bits '0', so that the resulting
	// message length (in bits) is congruent to 896 (mod 1024)
	g = (896 - (n + 1) % 1024);
	zeroes = g / 8 | 0;

	if (g < 0) {
		// we need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 896 / 8;
		tail = [];
	}


	// pad with zeroes
	for (j = 0; j < zeroes; ++j) {
		tail.push(0);
	}

	// append length of message (before preparation), in bits,
	// as 128-bit big-endian integer

	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 124) & 0xff);
	// tail.push((n >>> 116) & 0xff);
	// tail.push((n >>> 108) & 0xff);
	// tail.push((n >>> 96) & 0xff);
	// tail.push((n >>> 88) & 0xff);
	// tail.push((n >>> 80) & 0xff);
	// tail.push((n >>> 72) & 0xff);
	// tail.push((n >>> 64) & 0xff);
	// tail.push((n >>> 56) & 0xff);
	// tail.push((n >>> 48) & 0xff);
	// tail.push((n >>> 40) & 0xff);
	// tail.push((n >>> 32) & 0xff);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);

	tail.push((n >>> 24) & 0xff);
	tail.push((n >>> 16) & 0xff);
	tail.push((n >>>  8) & 0xff);
	tail.push((n >>>  0) & 0xff);

	call(h, tail, 0);

	for (i = 0, j = 0; j < 6; ++j) {
		digest[i] = (h[j][0] >>> 24) & 0xff;
		++i;
		digest[i] = (h[j][0] >>> 16) & 0xff;
		++i;
		digest[i] = (h[j][0] >>>  8) & 0xff;
		++i;
		digest[i] = (h[j][0] >>>  0) & 0xff;
		++i;
		digest[i] = (h[j][1] >>> 24) & 0xff;
		++i;
		digest[i] = (h[j][1] >>> 16) & 0xff;
		++i;
		digest[i] = (h[j][1] >>>  8) & 0xff;
		++i;
		digest[i] = (h[j][1] >>>  0) & 0xff;
		++i;
	}

	return digest;
};

exports.sha384 = sha384;

/* js/src/002-hash/sha512.js */


/**
 * SHA-512
 */

var sha512 = function (bytes, n, digest) {
	var q, z, u, last, h, m, y, o, i, j, tail, zeroes, g, k;


	// Note 1: All variables are unsigned 64 bits and wrap modulo 2^64 when calculating
	// Note 2: All constants in this pseudo code are in big endian

	// Initialize variables
	// (first 64 bits of the fractional parts of the square roots of the first 8 primes 2..19):
	h = [
		[0x6a09e667, 0xf3bcc908],
		[0xbb67ae85, 0x84caa73b],
		[0x3c6ef372, 0xfe94f82b],
		[0xa54ff53a, 0x5f1d36f1],
		[0x510e527f, 0xade682d1],
		[0x9b05688c, 0x2b3e6c1f],
		[0x1f83d9ab, 0xfb41bd6b],
		[0x5be0cd19, 0x137e2179]
	];

	// Initialize table of round constants
	// (first 64 bits of the fractional parts of the cube roots of the first 80 primes 2..311):
	k = [
		[0x428a2f98, 0xd728ae22], [0x71374491, 0x23ef65cd], [0xb5c0fbcf, 0xec4d3b2f], [0xe9b5dba5, 0x8189dbbc],
		[0x3956c25b, 0xf348b538], [0x59f111f1, 0xb605d019], [0x923f82a4, 0xaf194f9b], [0xab1c5ed5, 0xda6d8118],
		[0xd807aa98, 0xa3030242], [0x12835b01, 0x45706fbe], [0x243185be, 0x4ee4b28c], [0x550c7dc3, 0xd5ffb4e2],
		[0x72be5d74, 0xf27b896f], [0x80deb1fe, 0x3b1696b1], [0x9bdc06a7, 0x25c71235], [0xc19bf174, 0xcf692694],
		[0xe49b69c1, 0x9ef14ad2], [0xefbe4786, 0x384f25e3], [0x0fc19dc6, 0x8b8cd5b5], [0x240ca1cc, 0x77ac9c65],
		[0x2de92c6f, 0x592b0275], [0x4a7484aa, 0x6ea6e483], [0x5cb0a9dc, 0xbd41fbd4], [0x76f988da, 0x831153b5],
		[0x983e5152, 0xee66dfab], [0xa831c66d, 0x2db43210], [0xb00327c8, 0x98fb213f], [0xbf597fc7, 0xbeef0ee4],
		[0xc6e00bf3, 0x3da88fc2], [0xd5a79147, 0x930aa725], [0x06ca6351, 0xe003826f], [0x14292967, 0x0a0e6e70],
		[0x27b70a85, 0x46d22ffc], [0x2e1b2138, 0x5c26c926], [0x4d2c6dfc, 0x5ac42aed], [0x53380d13, 0x9d95b3df],
		[0x650a7354, 0x8baf63de], [0x766a0abb, 0x3c77b2a8], [0x81c2c92e, 0x47edaee6], [0x92722c85, 0x1482353b],
		[0xa2bfe8a1, 0x4cf10364], [0xa81a664b, 0xbc423001], [0xc24b8b70, 0xd0f89791], [0xc76c51a3, 0x0654be30],
		[0xd192e819, 0xd6ef5218], [0xd6990624, 0x5565a910], [0xf40e3585, 0x5771202a], [0x106aa070, 0x32bbd1b8],
		[0x19a4c116, 0xb8d2d0c8], [0x1e376c08, 0x5141ab53], [0x2748774c, 0xdf8eeb99], [0x34b0bcb5, 0xe19b48a8],
		[0x391c0cb3, 0xc5c95a63], [0x4ed8aa4a, 0xe3418acb], [0x5b9cca4f, 0x7763e373], [0x682e6ff3, 0xd6b2b8a3],
		[0x748f82ee, 0x5defb2fc], [0x78a5636f, 0x43172f60], [0x84c87814, 0xa1f0ab72], [0x8cc70208, 0x1a6439ec],
		[0x90befffa, 0x23631e28], [0xa4506ceb, 0xde82bde9], [0xbef9a3f7, 0xb2c67915], [0xc67178f2, 0xe372532b],
		[0xca273ece, 0xea26619c], [0xd186b8c7, 0x21c0c207], [0xeada7dd6, 0xcde0eb1e], [0xf57d4f7f, 0xee6ed178],
		[0x06f067aa, 0x72176fba], [0x0a637dc5, 0xa2c898a6], [0x113f9804, 0xbef90dae], [0x1b710b35, 0x131c471b],
		[0x28db77f5, 0x23047d84], [0x32caab7b, 0x40c72493], [0x3c9ebe0a, 0x15c9bebc], [0x431d67c4, 0x9c100d4c],
		[0x4cc5d4be, 0xcb3e42b6], [0x597f299c, 0xfc657e2a], [0x5fcb6fab, 0x3ad6faec], [0x6c44198c, 0x4a475817]
	];

	function cycle (state, w) {

		var j, a, b, c, d, e, f, g, h, t, s0, s1, ch, temp, maj;

		// initialize hash value for this chunk:
		a = state[0];
		b = state[1];
		c = state[2];
		d = state[3];
		e = state[4];
		f = state[5];
		g = state[6];
		h = state[7];

		// Main loop:
		// for j from 0 to 79
		for (j = 0; j < 80; ++j) {
			// S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
			s1 = xor64(xor64(rot64(e, 14), rot64(e, 18)), rot64(e, 41));
			// ch := (e and f) xor ((not e) and g)
			ch = xor64(and64(e, f), and64(not64(e), g));
			// temp := h + S1 + ch + k[j] + w[j]
			temp = add64(add64(h, s1), add64(add64(ch, k[j]), w[j]));
			// d := d + temp;
			d = add64(d, temp);
			// S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
			s0 = xor64(xor64(rot64(a, 28), rot64(a, 34)), rot64(a, 39));
			// maj := (a and (b xor c)) xor (b and c)
			maj = xor64(and64(a, xor64(b, c)), and64(b, c));
			// temp := temp + S0 + maj
			temp = add64(add64(temp, s0), maj);

			h = g;
			g = f;
			f = e;
			e = d;
			d = c;
			c = b;
			b = a;
			a = temp;
		}

		// Add this chunk's hash to result so far:
		state[0] = add64(state[0], a);
		state[1] = add64(state[1], b);
		state[2] = add64(state[2], c);
		state[3] = add64(state[3], d);
		state[4] = add64(state[4], e);
		state[5] = add64(state[5], f);
		state[6] = add64(state[6], g);
		state[7] = add64(state[7], h);
	}

	function call (h, data, o) {

		var w, j, s0, s1;

		w = new Array(80);

		// break chunk into sixteen 64-bit big-endian words w[i], 0 ≤ i ≤ 15
		for (j = 0; j < 16; ++j) {
			w[j] = big64(data, o + j * 8);
		}

		// Extend the sixteen 64-bit words into 80 64-bit words:
		// for j from 16 to 79
		for (j = 16; j < 80; ++j) {
			// s0 := (w[j-15] rightrotate 1) xor (w[j-15] rightrotate 8) xor (w[j-15] rightshift 7)
			s0 = xor64(xor64(rot64(w[j-15],  1), rot64(w[j-15],  8)), sh64(w[j-15], 7));
			// s1 := (w[j-2] rightrotate 19) xor (w[j-2] rightrotate 61) xor (w[j-2] rightshift 6)
			s1 = xor64(xor64(rot64(w[j- 2], 19), rot64(w[j- 2], 61)), sh64(w[j- 2], 6));
			// w[j] := w[j-16] + s0 + w[j-7] + s1
			w[j] = add64(add64(w[j-16], s0), add64(w[j-7], s1));
		}


		cycle(h, w);
	}


	// PREPARE

	q = n / 8 | 0;
	z = q * 8;
	u = n - z;

	// append the bit '1' to the message
	if (u > 0) {
		last = bytes[q] & (~0) << (7-u);
	}
	else {
		last = 0x80;
	}


	// Process the message in successive 1024-bit chunks:
	// break message into 1024-bit chunks

	m = n / 1024 | 0;
	y = (n - 1024 * m) / 8 | 0;

	// offset in data
	o = 0;

	// for each chunk
	for (j = 0; j < m; ++j, o += 128) {
		call(h, bytes, o);
	}

	// last bytes + padding + length
	tail = [];

	// last bytes
	for (j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	// special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	tail.push(last);


	// append 0 ≤ k < 1024 bits '0', so that the resulting
	// message length (in bits) is congruent to 896 (mod 1024)
	g = (896 - (n + 1) % 1024);
	zeroes = g / 8 | 0;

	if (g < 0) {
		// we need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 896 / 8;
		tail = [];
	}


	// pad with zeroes
	for (j = 0; j < zeroes; ++j) {
		tail.push(0);
	}

	// append length of message (before preparation), in bits,
	// as 128-bit big-endian integer

	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 124) & 0xff);
	// tail.push((n >>> 116) & 0xff);
	// tail.push((n >>> 108) & 0xff);
	// tail.push((n >>> 96) & 0xff);
	// tail.push((n >>> 88) & 0xff);
	// tail.push((n >>> 80) & 0xff);
	// tail.push((n >>> 72) & 0xff);
	// tail.push((n >>> 64) & 0xff);
	// tail.push((n >>> 56) & 0xff);
	// tail.push((n >>> 48) & 0xff);
	// tail.push((n >>> 40) & 0xff);
	// tail.push((n >>> 32) & 0xff);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);

	tail.push((n >>> 24) & 0xff);
	tail.push((n >>> 16) & 0xff);
	tail.push((n >>>  8) & 0xff);
	tail.push((n >>>  0) & 0xff);

	call(h, tail, 0);

	for (i = 0, j = 0; j < 8; ++j) {
		digest[i] = (h[j][0] >>> 24) & 0xff;
		++i;
		digest[i] = (h[j][0] >>> 16) & 0xff;
		++i;
		digest[i] = (h[j][0] >>>  8) & 0xff;
		++i;
		digest[i] = (h[j][0] >>>  0) & 0xff;
		++i;
		digest[i] = (h[j][1] >>> 24) & 0xff;
		++i;
		digest[i] = (h[j][1] >>> 16) & 0xff;
		++i;
		digest[i] = (h[j][1] >>>  8) & 0xff;
		++i;
		digest[i] = (h[j][1] >>>  0) & 0xff;
		++i;
	}

	return digest;
};

exports.sha512 = sha512;

})(typeof exports === 'undefined' ? this['hash'] = {} : exports);
