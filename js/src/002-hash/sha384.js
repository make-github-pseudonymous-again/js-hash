

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
