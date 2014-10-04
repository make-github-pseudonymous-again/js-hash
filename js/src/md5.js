

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
