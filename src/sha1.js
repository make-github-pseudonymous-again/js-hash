import { big32 , rot32 , add32 } from '@aureooms/js-uint32' ;

function cycle (h, w) {

	// initialize hash value for this chunk:
	let a = h[0];
	let b = h[1];
	let c = h[2];
	let d = h[3];
	let e = h[4];

	// Main loop:[35]
	// for j from 0 to 79
	for (let j = 0; j < 80; ++j) {

		let f, k;

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
		const t = add32(add32(rot32(a, 5), f), add32(add32(e, k), w[j]));
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

	const w = new Array(80);

	// break chunk into sixteen 32-bit big-endian words w[i], 0 ≤ i ≤ 15
	for (let j = 0; j < 16; ++j) {
		w[j] = big32(data, o + j * 4);
	}

	// Extend the sixteen 32-bit words into eighty 32-bit words:
	// for j from 16 to 79
	for(let j = 16; j < 80; ++j){
		// w[j] = (w[j-3] xor w[j-8] xor w[j-14] xor w[j-16]) leftrotate 1
		const k = (w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16]);
		w[j] = rot32(k, 1);
	}

	cycle(h, w);

}

/**
 * SHA1
 */
export function sha1 (bytes, n, digest) {

	// PREPARE

	const q = n / 8 | 0;
	const z = q * 8;
	const u = n - z;

	// append the bit '1' to the message
	let last ;
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
	const h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];

	// Process the message in successive 512-bit chunks:
	// break message into 512-bit chunks

	const m = n / 512 | 0;
	const y = (n - 512 * m) / 8 | 0;

	// offset in data
	let o = 0;

	// for each chunk
	for (let j = 0; j < m; ++j, o += 64) {
		call(h, bytes, o);
	}

	// last bytes + padding + length
	let tail = [];

	// last bytes
	for (let j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	// special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	tail.push(last);


	// append 0 ≤ k < 512 bits '0', so that the resulting
	// message length (in bits) is congruent to 448 (mod 512)
	let zeroes = (448 - (n + 1) % 512) / 8 | 0;

	if (zeroes < 0) {
		// we need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (let j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 448 / 8;
		tail = [];
	}


	// pad with zeroes
	for (let j = 0; j < zeroes; ++j) {
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

}
