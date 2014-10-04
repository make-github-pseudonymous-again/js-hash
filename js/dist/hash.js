(function(exports, undefined){

	'use strict';


/* js/src/md5.js */


/**
 * MD5
 */

var md5 = function (bytes, n, digest) {

	var k, r, h, last, z, zeroes, j, m, o, q, y, tail, u;

	function rot (word, shift) {
		return (word << shift) | (word >>> (32 - shift));
	}

	function add32 (a, b) {
		return (a + b) & 0xffffffff;
	}

	function lil32 (a, o) {
		return (a[o + 3] << 24) |
		       (a[o + 2] << 16) |
		       (a[o + 1] <<  8) |
		        a[o + 0];
	}

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
			b = add32(b, rot(add32(add32(a, f), add32(k[i], w[g])) , r[i]));
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

/* js/src/md5fast.js */


/**
 * MD5 inlined implementation
 */

var md5fast = function (bytes, n, digest) {
	var h, len, last, z, zeroes,
	    j, m, o, q, y, tail, u;

	function add32 (a, b) {
		return (a + b) & 0xffffffff;
	}

	function lil32 (a, o) {
		return (a[o + 3] << 24) |
		       (a[o + 2] << 16) |
		       (a[o + 1] <<  8) |
		        a[o + 0];
	}

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

/* js/src/sha1.js */


/**
 * SHA1
 */

var sha1 = function (bytes, n, digest) {

	var q, z, u, last, h, m, y, o, j, tail, zeroes;

	function rot (word, shift) {
		return (word << shift) | (word >>> (32 - shift));
	}

	function add32 (a, b) {
		return (a + b) & 0xffffffff;
	}

	function big32 (a, o) {
		return (a[o + 0] << 24) |
		       (a[o + 1] << 16) |
		       (a[o + 2] <<  8) |
		        a[o + 3];
	}

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
			t = rot(a, 5) + f + e + k + w[j];
			e = d;
			d = c;
			// c = b leftrotate 30
			c = rot(b, 30);
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
			w[j] = rot(k, 1);
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

/* js/src/sha224.js */


/**
 * SHA224
 */

var sha224 = function (args2) {

};

exports.sha224 = sha224;

/* js/src/sha256.js */


/**
 * SHA256
 */

var sha256 = function (args2) {

};

exports.sha256 = sha256;

/* js/src/sha384.js */


/**
 * SHA384
 */

var sha384 = function (args2) {

};

exports.sha384 = sha384;

/* js/src/sha512.js */


/**
 * SHA512
 */

var sha512 = function (args2) {

};

exports.sha512 = sha512;

})(typeof exports === 'undefined' ? this['hash'] = {} : exports);
