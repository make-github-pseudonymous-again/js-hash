import { add32 , big32 } from '../uint32' ;

const k = [
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
] ;

function cycle (state, w) {

	// initialize hash value for this chunk:
	let a = state[0];
	let b = state[1];
	let c = state[2];
	let d = state[3];
	let e = state[4];
	let f = state[5];
	let g = state[6];
	let h = state[7];

	//Main loop:
	//for j from 0 to 63
	for(let j = 0; j < 64; ++j){
		//S1 := (e rightrotate 6) xor (e rightrotate 11) xor (e rightrotate 25)
		const s1 = (e >>> 6 | e << 26) ^(e >>> 11 | e << 21) ^(e >>> 25 | e << 7);
		//ch := (e and f) xor ((not e) and g)
		const ch = (e & f) ^ ((~e) & g);
		//temp := h + S1 + ch + k[j] + w[j]
		let temp = add32(add32(h, s1), add32(add32(ch, k[j]), w[j]));
		//d := d + temp;
		d = add32(d, temp);
		//S0 := (a rightrotate 2) xor (a rightrotate 13) xor (a rightrotate 22)
		const s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
		//maj := (a and (b xor c)) xor (b and c)
		const maj = (a & (b ^ c)) ^ (b & c);
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

	const w = new Array(64);

	// break chunk into sixteen 32-bit big-endian words w[i], 0 ≤ i ≤ 15
	for (let j = 0; j < 16; ++j) {
		w[j] = big32(data, o + j * 4);
	}

	// Extend the sixteen 32-bit words into sixty-four 32-bit words:
	// for j from 16 to 63
	for (let j = 16; j < 64; ++j) {
		//s0 := (w[j-15] rightrotate 7) xor (w[j-15] rightrotate 18) xor (w[j-15] rightshift 3)
		const s0 = (w[j-15] >>> 7 | w[j-15] << 25) ^ (w[j-15] >>> 18 | w[j-15] << 14) ^ (w[j-15] >>> 3);
		//s1 := (w[j-2] rightrotate 17) xor (w[j-2] rightrotate 19) xor (w[j-2] rightshift 10)
		const s1 = (w[j-2] >>> 17 | w[j-2] << 15) ^ (w[j-2] >>> 19 | w[j-2] << 13) ^ (w[j-2] >>> 10);
		//w[j] := w[j-16] + s0 + w[j-7] + s1
		w[j] = add32(add32(w[j-16], s0), add32(w[j-7], s1));
	}

	cycle(h, w);

}

/**
 * SHA-256
 */
export function sha256 (bytes, n, digest) {

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
	const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

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

}
