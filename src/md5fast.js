import { get32 , lil32 , add32 } from '@aureooms/js-uint32' ;

function cycle(x, k) {
	let a = x[0], b = x[1], c = x[2], d = x[3];

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

	//break chunk into sixteen 32-bit little-endian words w[i], 0 ≤ i ≤ 15

	const w = [
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

/**
 * MD5 inlined implementation
 */

export function md5fast (bytes, n, digest) {

	// PREPARE

	const q = n / 8 | 0;
	const z = q * 8;
	const u = n - z;

	// append the bit '1' to the message
	let last;
	if (u > 0) {
		last = bytes[q] & (~0) << (7-u);
	}
	else {
		last = 0x80;
	}

	// initialize state
	const h = [
		get32(0x67452301),
		get32(0xefcdab89),
		get32(0x98badcfe),
		get32(0x10325476),
	] ;

	// Process the message in successive 512-bit chunks:
	// break message into 512-bit chunks

	const m = n / 512 | 0;
	const y = (n - 512 * m) / 8 | 0;

	// for each chunk
	let o = 0;

	for (let j = 0; j < m; ++j, o += 64) {
		call(h, bytes, o);
	}

	let tail = [];

	for (let j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	tail.push(last);

	// append 0 ≤ k < 512 bits '0', so that the resulting
	// message length (in bits) is congruent to 448 (mod 512)
	let zeroes = (448 - (n + 1) % 512) / 8 | 0;

	if (zeroes < 0) {
		for (let j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 448 / 8;
		tail = [];
	}


	for (let j = 0; j < zeroes; ++j) {
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

}
