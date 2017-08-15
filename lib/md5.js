'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.md5 = md5;

var _jsUint = require('@aureooms/js-uint32');

function cycle(h, k, r, w) {

	// initialize hash value for this chunk:
	var a = h[0];
	var b = h[1];
	var c = h[2];
	var d = h[3];

	// main loop
	for (var i = 0; i < 64; ++i) {

		var f = void 0,
		    g = void 0;

		if (i < 16) {
			f = b & c | ~b & d;
			g = i;
		} else if (i < 32) {
			f = d & b | ~d & c;
			g = (5 * i + 1) % 16;
		} else if (i < 48) {
			f = b ^ c ^ d;
			g = (3 * i + 5) % 16;
		} else {
			f = c ^ (b | ~d);
			g = 7 * i % 16;
		}

		var t = d;
		d = c;
		c = b;
		b = (0, _jsUint.add32)(b, (0, _jsUint.rotl32)((0, _jsUint.add32)((0, _jsUint.add32)(a, f), (0, _jsUint.add32)(k[i], w[g])), r[i]));
		a = t;
	}

	// Add this chunk's hash to result so far:
	h[0] = (0, _jsUint.add32)(h[0], a);
	h[1] = (0, _jsUint.add32)(h[1], b);
	h[2] = (0, _jsUint.add32)(h[2], c);
	h[3] = (0, _jsUint.add32)(h[3], d);
}

function call(h, k, r, data, o) {

	//break chunk into sixteen 32-bit little-endian words w[i], 0 ≤ i ≤ 15

	var w = [(0, _jsUint.lil32)(data, o + 0), (0, _jsUint.lil32)(data, o + 4), (0, _jsUint.lil32)(data, o + 8), (0, _jsUint.lil32)(data, o + 12), (0, _jsUint.lil32)(data, o + 16), (0, _jsUint.lil32)(data, o + 20), (0, _jsUint.lil32)(data, o + 24), (0, _jsUint.lil32)(data, o + 28), (0, _jsUint.lil32)(data, o + 32), (0, _jsUint.lil32)(data, o + 36), (0, _jsUint.lil32)(data, o + 40), (0, _jsUint.lil32)(data, o + 44), (0, _jsUint.lil32)(data, o + 48), (0, _jsUint.lil32)(data, o + 52), (0, _jsUint.lil32)(data, o + 56), (0, _jsUint.lil32)(data, o + 60)];

	cycle(h, k, r, w);
}

/**
 * MD5
 */
function md5(bytes, n, digest) {

	var k = [(0, _jsUint.get32)(0xd76aa478), (0, _jsUint.get32)(0xe8c7b756), (0, _jsUint.get32)(0x242070db), (0, _jsUint.get32)(0xc1bdceee), (0, _jsUint.get32)(0xf57c0faf), (0, _jsUint.get32)(0x4787c62a), (0, _jsUint.get32)(0xa8304613), (0, _jsUint.get32)(0xfd469501), (0, _jsUint.get32)(0x698098d8), (0, _jsUint.get32)(0x8b44f7af), (0, _jsUint.get32)(0xffff5bb1), (0, _jsUint.get32)(0x895cd7be), (0, _jsUint.get32)(0x6b901122), (0, _jsUint.get32)(0xfd987193), (0, _jsUint.get32)(0xa679438e), (0, _jsUint.get32)(0x49b40821), (0, _jsUint.get32)(0xf61e2562), (0, _jsUint.get32)(0xc040b340), (0, _jsUint.get32)(0x265e5a51), (0, _jsUint.get32)(0xe9b6c7aa), (0, _jsUint.get32)(0xd62f105d), (0, _jsUint.get32)(0x02441453), (0, _jsUint.get32)(0xd8a1e681), (0, _jsUint.get32)(0xe7d3fbc8), (0, _jsUint.get32)(0x21e1cde6), (0, _jsUint.get32)(0xc33707d6), (0, _jsUint.get32)(0xf4d50d87), (0, _jsUint.get32)(0x455a14ed), (0, _jsUint.get32)(0xa9e3e905), (0, _jsUint.get32)(0xfcefa3f8), (0, _jsUint.get32)(0x676f02d9), (0, _jsUint.get32)(0x8d2a4c8a), (0, _jsUint.get32)(0xfffa3942), (0, _jsUint.get32)(0x8771f681), (0, _jsUint.get32)(0x6d9d6122), (0, _jsUint.get32)(0xfde5380c), (0, _jsUint.get32)(0xa4beea44), (0, _jsUint.get32)(0x4bdecfa9), (0, _jsUint.get32)(0xf6bb4b60), (0, _jsUint.get32)(0xbebfbc70), (0, _jsUint.get32)(0x289b7ec6), (0, _jsUint.get32)(0xeaa127fa), (0, _jsUint.get32)(0xd4ef3085), (0, _jsUint.get32)(0x04881d05), (0, _jsUint.get32)(0xd9d4d039), (0, _jsUint.get32)(0xe6db99e5), (0, _jsUint.get32)(0x1fa27cf8), (0, _jsUint.get32)(0xc4ac5665), (0, _jsUint.get32)(0xf4292244), (0, _jsUint.get32)(0x432aff97), (0, _jsUint.get32)(0xab9423a7), (0, _jsUint.get32)(0xfc93a039), (0, _jsUint.get32)(0x655b59c3), (0, _jsUint.get32)(0x8f0ccc92), (0, _jsUint.get32)(0xffeff47d), (0, _jsUint.get32)(0x85845dd1), (0, _jsUint.get32)(0x6fa87e4f), (0, _jsUint.get32)(0xfe2ce6e0), (0, _jsUint.get32)(0xa3014314), (0, _jsUint.get32)(0x4e0811a1), (0, _jsUint.get32)(0xf7537e82), (0, _jsUint.get32)(0xbd3af235), (0, _jsUint.get32)(0x2ad7d2bb), (0, _jsUint.get32)(0xeb86d391)];

	var r = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

	// PREPARE

	var q = n / 8 | 0;
	var z = q * 8;
	var u = n - z;

	// append the bit '1' to the message
	var last = void 0;
	if (u > 0) {
		last = bytes[q] & ~0 << 7 - u;
	} else {
		last = 0x80;
	}

	// initialize state
	var h = [(0, _jsUint.get32)(0x67452301), (0, _jsUint.get32)(0xefcdab89), (0, _jsUint.get32)(0x98badcfe), (0, _jsUint.get32)(0x10325476)];

	// Process the message in successive 512-bit chunks:
	// break message into 512-bit chunks

	var m = n / 512 | 0;
	var y = (n - 512 * m) / 8 | 0;

	// offset in data
	var o = 0;

	// for each chunk
	for (var j = 0; j < m; ++j, o += 64) {
		call(h, k, r, bytes, o);
	}

	// last bytes + padding + length
	var tail = [];

	// last bytes
	for (var _j = 0; _j < y; ++_j) {
		tail.push(bytes[o + _j]);
	}

	// special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	tail.push(last);

	// append 0 ≤ k < 512 bits '0', so that the resulting
	// message length (in bits) is congruent to 448 (mod 512)
	var zeroes = (448 - (n + 1) % 512) / 8 | 0;

	if (zeroes < 0) {
		// we need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (var _j2 = 0; _j2 < -zeroes; ++_j2) {
			tail.push(0);
		}

		call(h, k, r, tail, 0);

		zeroes = 448 / 8;
		tail = [];
	}

	// pad with zeroes
	for (var _j3 = 0; _j3 < zeroes; ++_j3) {
		tail.push(0);
	}

	// append length of message (before preparation), in bits,
	// as 64-bit little-endian integer

	tail.push(n >>> 0 & 0xFF);
	tail.push(n >>> 8 & 0xFF);
	tail.push(n >>> 16 & 0xFF);
	tail.push(n >>> 24 & 0xFF);
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

	digest[0] = h[0] >>> 0 & 0xFF;
	digest[1] = h[0] >>> 8 & 0xFF;
	digest[2] = h[0] >>> 16 & 0xFF;
	digest[3] = h[0] >>> 24 & 0xFF;
	digest[4] = h[1] >>> 0 & 0xFF;
	digest[5] = h[1] >>> 8 & 0xFF;
	digest[6] = h[1] >>> 16 & 0xFF;
	digest[7] = h[1] >>> 24 & 0xFF;
	digest[8] = h[2] >>> 0 & 0xFF;
	digest[9] = h[2] >>> 8 & 0xFF;
	digest[10] = h[2] >>> 16 & 0xFF;
	digest[11] = h[2] >>> 24 & 0xFF;
	digest[12] = h[3] >>> 0 & 0xFF;
	digest[13] = h[3] >>> 8 & 0xFF;
	digest[14] = h[3] >>> 16 & 0xFF;
	digest[15] = h[3] >>> 24 & 0xFF;

	return digest;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tZDUuanMiXSwibmFtZXMiOlsibWQ1IiwiY3ljbGUiLCJoIiwiayIsInIiLCJ3IiwiYSIsImIiLCJjIiwiZCIsImkiLCJmIiwiZyIsInQiLCJjYWxsIiwiZGF0YSIsIm8iLCJieXRlcyIsIm4iLCJkaWdlc3QiLCJxIiwieiIsInUiLCJsYXN0IiwibSIsInkiLCJqIiwidGFpbCIsInB1c2giLCJ6ZXJvZXMiXSwibWFwcGluZ3MiOiI7Ozs7O1FBOEVnQkEsRyxHQUFBQSxHOztBQTlFaEI7O0FBRUEsU0FBU0MsS0FBVCxDQUFnQkMsQ0FBaEIsRUFBbUJDLENBQW5CLEVBQXNCQyxDQUF0QixFQUF5QkMsQ0FBekIsRUFBNEI7O0FBRTNCO0FBQ0EsS0FBSUMsSUFBSUosRUFBRSxDQUFGLENBQVI7QUFDQSxLQUFJSyxJQUFJTCxFQUFFLENBQUYsQ0FBUjtBQUNBLEtBQUlNLElBQUlOLEVBQUUsQ0FBRixDQUFSO0FBQ0EsS0FBSU8sSUFBSVAsRUFBRSxDQUFGLENBQVI7O0FBRUE7QUFDQSxNQUFLLElBQUlRLElBQUksQ0FBYixFQUFnQkEsSUFBSSxFQUFwQixFQUF3QixFQUFFQSxDQUExQixFQUE2Qjs7QUFFNUIsTUFBSUMsVUFBSjtBQUFBLE1BQVFDLFVBQVI7O0FBRUEsTUFBSUYsSUFBSSxFQUFSLEVBQVk7QUFDWEMsT0FBS0osSUFBSUMsQ0FBTCxHQUFZLENBQUVELENBQUgsR0FBUUUsQ0FBdkI7QUFDQUcsT0FBSUYsQ0FBSjtBQUNBLEdBSEQsTUFJSyxJQUFJQSxJQUFJLEVBQVIsRUFBWTtBQUNoQkMsT0FBS0YsSUFBSUYsQ0FBTCxHQUFZLENBQUVFLENBQUgsR0FBUUQsQ0FBdkI7QUFDQUksT0FBSSxDQUFDLElBQUlGLENBQUosR0FBUSxDQUFULElBQWMsRUFBbEI7QUFDQSxHQUhJLE1BSUEsSUFBSUEsSUFBSSxFQUFSLEVBQVk7QUFDaEJDLE9BQUlKLElBQUlDLENBQUosR0FBUUMsQ0FBWjtBQUNBRyxPQUFJLENBQUMsSUFBSUYsQ0FBSixHQUFR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LCByb3RsMzIgLCBsaWwzMiB9IGZyb20gJ0BhdXJlb29tcy9qcy11aW50MzInIDtcblxuZnVuY3Rpb24gY3ljbGUgKGgsIGssIHIsIHcpIHtcblxuXHQvLyBpbml0aWFsaXplIGhhc2ggdmFsdWUgZm9yIHRoaXMgY2h1bms6XG5cdGxldCBhID0gaFswXTtcblx0bGV0IGIgPSBoWzFdO1xuXHRsZXQgYyA9IGhbMl07XG5cdGxldCBkID0gaFszXTtcblxuXHQvLyBtYWluIGxvb3Bcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCA2NDsgKytpKSB7XG5cblx0XHRsZXQgZiAsIGcgO1xuXG5cdFx0aWYgKGkgPCAxNikge1xuXHRcdFx0ZiA9IChiICYgYykgfCAoKH4gYikgJiBkKTtcblx0XHRcdGcgPSBpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChpIDwgMzIpIHtcblx0XHRcdGYgPSAoZCAmIGIpIHwgKCh+IGQpICYgYyk7XG5cdFx0XHRnID0gKDUgKiBpICsgMSkgJSAxNjtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoaSA8IDQ4KSB7XG5cdFx0XHRmID0gYiBeIGMgXiBkO1xuXHRcdFx0ZyA9ICgzICogaSArIDUpICUgMTY7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZiA9IGMgXiAoYiB8ICh+IGQpKTtcblx0XHRcdGcgPSAoNyAqIGkpICUgMTY7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdCA9IGQ7XG5cdFx0ZCA9IGM7XG5cdFx0YyA9IGI7XG5cdFx0YiA9IGFkZDMyKGIsIHJvdGwzMihhZGQzMihhZGQzMihhLCBmKSwgYWRkMzIoa1tpXSwgd1tnXSkpICwgcltpXSkpO1xuXHRcdGEgPSB0O1xuXG5cdH1cblxuXHQvLyBBZGQgdGhpcyBjaHVuaydzIGhhc2ggdG8gcmVzdWx0IHNvIGZhcjpcblx0aFswXSA9IGFkZDMyKGhbMF0sIGEpO1xuXHRoWzFdID0gYWRkMzIoaFsxXSwgYik7XG5cdGhbMl0gPSBhZGQzMihoWzJdLCBjKTtcblx0aFszXSA9IGFkZDMyKGhbM10sIGQpO1xuXG59XG5cbmZ1bmN0aW9uIGNhbGwgKGgsIGssIHIsIGRhdGEsIG8pIHtcblxuXHQvL2JyZWFrIGNodW5rIGludG8gc2l4dGVlbiAzMi1iaXQgbGl0dGxlLWVuZGlhbiB3b3JkcyB3W2ldLCAwIOKJpCBpIOKJpCAxNVxuXG5cdGNvbnN0IHcgPSBbXG5cdFx0bGlsMzIoZGF0YSwgbyArICAwKSxcblx0XHRsaWwzMihkYXRhLCBvICsgIDQpLFxuXHRcdGxpbDMyKGRhdGEsIG8gKyAgOCksXG5cdFx0bGlsMzIoZGF0YSwgbyArIDEyKSxcblx0XHRsaWwzMihkYXRhLCBvICsgMTYpLFxuXHRcdGxpbDMyKGRhdGEsIG8gKyAyMCksXG5cdFx0bGlsMzIoZGF0YSwgbyArIDI0KSxcblx0XHRsaWwzMihkYXRhLCBvICsgMjgpLFxuXHRcdGxpbDMyKGRhdGEsIG8gKyAzMiksXG5cdFx0bGlsMzIoZGF0YSwgbyArIDM2KSxcblx0XHRsaWwzMihkYXRhLCBvICsgNDApLFxuXHRcdGxpbDMyKGRhdGEsIG8gKyA0NCksXG5cdFx0bGlsMzIoZGF0YSwgbyArIDQ4KSxcblx0XHRsaWwzMihkYXRhLCBvICsgNTIpLFxuXHRcdGxpbDMyKGRhdGEsIG8gKyA1NiksXG5cdFx0bGlsMzIoZGF0YSwgbyArIDYwKVxuXHRdO1xuXG5cdGN5Y2xlKGgsIGssIHIsIHcpO1xuXG59XG5cbi8qKlxuICogTUQ1XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZDUgKGJ5dGVzLCBuLCBkaWdlc3QpIHtcblxuXHRjb25zdCBrID0gW1xuXHRcdGdldDMyKDB4ZDc2YWE0NzgpLCBnZXQzMigweGU4YzdiNzU2KSwgZ2V0MzIoMHgyNDIwNzBkYiksIGdldDMyKDB4YzFiZGNlZWUpLFxuXHRcdGdldDMyKDB4ZjU3YzBmYWYpLCBnZXQzMigweDQ3ODdjNjJhKSwgZ2V0MzIoMHhhODMwNDYxMyksIGdldDMyKDB4ZmQ0Njk1MDEpLFxuXHRcdGdldDMyKDB4Njk4MDk4ZDgpLCBnZXQzMigweDhiNDRmN2FmKSwgZ2V0MzIoMHhmZmZmNWJiMSksIGdldDMyKDB4ODk1Y2Q3YmUpLFxuXHRcdGdldDMyKDB4NmI5MDExMjIpLCBnZXQzMigweGZkOTg3MTkzKSwgZ2V0MzIoMHhhNjc5NDM4ZSksIGdldDMyKDB4NDliNDA4MjEpLFxuXHRcdGdldDMyKDB4ZjYxZTI1NjIpLCBnZXQzMigweGMwNDBiMzQwKSwgZ2V0MzIoMHgyNjVlNWE1MSksIGdldDMyKDB4ZTliNmM3YWEpLFxuXHRcdGdldDMyKDB4ZDYyZjEwNWQpLCBnZXQzMigweDAyNDQxNDUzKSwgZ2V0MzIoMHhkOGExZTY4MSksIGdldDMyKDB4ZTdkM2ZiYzgpLFxuXHRcdGdldDMyKDB4MjFlMWNkZTYpLCBnZXQzMigweGMzMzcwN2Q2KSwgZ2V0MzIoMHhmNGQ1MGQ4NyksIGdldDMyKDB4NDU1YTE0ZWQpLFxuXHRcdGdldDMyKDB4YTllM2U5MDUpLCBnZXQzMigweGZjZWZhM2Y4KSwgZ2V0MzIoMHg2NzZmMDJkOSksIGdldDMyKDB4OGQyYTRjOGEpLFxuXHRcdGdldDMyKDB4ZmZmYTM5NDIpLCBnZXQzMigweDg3NzFmNjgxKSwgZ2V0MzIoMHg2ZDlkNjEyMiksIGdldDMyKDB4ZmRlNTM4MGMpLFxuXHRcdGdldDMyKDB4YTRiZWVhNDQpLCBnZXQzMigweDRiZGVjZmE5KSwgZ2V0MzIoMHhmNmJiNGI2MCksIGdldDMyKDB4YmViZmJjNzApLFxuXHRcdGdldDMyKDB4Mjg5YjdlYzYpLCBnZXQzMigweGVhYTEyN2ZhKSwgZ2V0MzIoMHhkNGVmMzA4NSksIGdldDMyKDB4MDQ4ODFkMDUpLFxuXHRcdGdldDMyKDB4ZDlkNGQwMzkpLCBnZXQzMigweGU2ZGI5OWU1KSwgZ2V0MzIoMHgxZmEyN2NmOCksIGdldDMyKDB4YzRhYzU2NjUpLFxuXHRcdGdldDMyKDB4ZjQyOTIyNDQpLCBnZXQzMigweDQzMmFmZjk3KSwgZ2V0MzIoMHhhYjk0MjNhNyksIGdldDMyKDB4ZmM5M2EwMzkpLFxuXHRcdGdldDMyKDB4NjU1YjU5YzMpLCBnZXQzMigweDhmMGNjYzkyKSwgZ2V0MzIoMHhmZmVmZjQ3ZCksIGdldDMyKDB4ODU4NDVkZDEpLFxuXHRcdGdldDMyKDB4NmZhODdlNGYpLCBnZXQzMigweGZlMmNlNmUwKSwgZ2V0MzIoMHhhMzAxNDMxNCksIGdldDMyKDB4NGUwODExYTEpLFxuXHRcdGdldDMyKDB4Zjc1MzdlODIpLCBnZXQzMigweGJkM2FmMjM1KSwgZ2V0MzIoMHgyYWQ3ZDJiYiksIGdldDMyKDB4ZWI4NmQzOTEpLFxuXHRdIDtcblxuXHRjb25zdCByID0gW1xuXHRcdDcsIDEyLCAxNywgMjIsIDcsIDEyLCAxNywgMjIsIDcsIDEyLCAxNywgMjIsIDcsIDEyLCAxNywgMjIsXG5cdFx0NSwgIDksIDE0LCAyMCwgNSwgIDksIDE0LCAyMCwgNSwgIDksIDE0LCAyMCwgNSwgIDksIDE0LCAyMCxcblx0XHQ0LCAxMSwgMTYsIDIzLCA0LCAxMSwgMTYsIDIzLCA0LCAxMSwgMTYsIDIzLCA0LCAxMSwgMTYsIDIzLFxuXHRcdDYsIDEwLCAxNSwgMjEsIDYsIDEwLCAxNSwgMjEsIDYsIDEwLCAxNSwgMjEsIDYsIDEwLCAxNSwgMjFcblx0XTtcblxuXHQvLyBQUkVQQVJFXG5cblx0Y29uc3QgcSA9IG4gLyA4IHwgMDtcblx0Y29uc3QgeiA9IHEgKiA4O1xuXHRjb25zdCB1ID0gbiAtIHo7XG5cblx0Ly8gYXBwZW5kIHRoZSBiaXQgJzEnIHRvIHRoZSBtZXNzYWdlXG5cdGxldCBsYXN0IDtcblx0aWYgKHUgPiAwKSB7XG5cdFx0bGFzdCA9IGJ5dGVzW3FdICYgKH4wKSA8PCAoNy11KTtcblx0fVxuXHRlbHNlIHtcblx0XHRsYXN0ID0gMHg4MDtcblx0fVxuXG5cdC8vIGluaXRpYWxpemUgc3RhdGVcblx0Y29uc3QgaCA9IFtcblx0XHRnZXQzMigweDY3NDUyMzAxKSxcblx0XHRnZXQzMigweGVmY2RhYjg5KSxcblx0XHRnZXQzMigweDk4YmFkY2ZlKSxcblx0XHRnZXQzMigweDEwMzI1NDc2KSxcblx0XSA7XG5cblx0Ly8gUHJvY2VzcyB0aGUgbWVzc2FnZSBpbiBzdWNjZXNzaXZlIDUxMi1iaXQgY2h1bmtzOlxuXHQvLyBicmVhayBtZXNzYWdlIGludG8gNTEyLWJpdCBjaHVua3NcblxuXHRjb25zdCBtID0gbiAvIDUxMiB8IDA7XG5cdGNvbnN0IHkgPSAobiAtIDUxMiAqIG0pIC8gOCB8IDA7XG5cblx0Ly8gb2Zmc2V0IGluIGRhdGFcblx0bGV0IG8gPSAwO1xuXG5cdC8vIGZvciBlYWNoIGNodW5rXG5cdGZvciAobGV0IGogPSAwOyBqIDwgbTsgKytqLCBvICs9IDY0KSB7XG5cdFx0Y2FsbChoLCBrLCByLCBieXRlcywgbyk7XG5cdH1cblxuXHQvLyBsYXN0IGJ5dGVzICsgcGFkZGluZyArIGxlbmd0aFxuXHRsZXQgdGFpbCA9IFtdO1xuXG5cdC8vIGxhc3QgYnl0ZXNcblx0Zm9yIChsZXQgaiA9IDA7IGogPCB5OyArK2opIHtcblx0XHR0YWlsLnB1c2goYnl0ZXNbbyArIGpdKTtcblx0fVxuXG5cdC8vIHNwZWNpYWwgY2FyZSB0YWtlbiBmb3IgdGhlIHZlcnkgbGFzdCBieXRlIHdoaWNoIGNvdWxkXG5cdC8vIGhhdmUgYmVlbiBtb2RpZmllZCBpZiBuIGlzIG5vdCBhIG11bHRpcGxlIG9mIDhcblx0dGFpbC5wdXNoKGxhc3QpO1xuXG5cblx0Ly8gYXBwZW5kIDAg4omkIGsgPCA1MTIgYml0cyAnMCcsIHNvIHRoYXQgdGhlIHJlc3VsdGluZ1xuXHQvLyBtZXNzYWdlIGxlbmd0aCAoaW4gYml0cykgaXMgY29uZ3J1ZW50IHRvIDQ0OCAobW9kIDUxMilcblx0bGV0IHplcm9lcyA9ICg0NDggLSAobiArIDEpICUgNTEyKSAvIDggfCAwO1xuXG5cdGlmICh6ZXJvZXMgPCAwKSB7XG5cdFx0Ly8gd2UgbmVlZCBhbiBhZGRpdGlvbmFsIGJsb2NrIGFzIHRoZXJlIGlzXG5cdFx0Ly8gbm90IGVub3VnaCBzcGFjZSBsZWZ0IHRvIGFwcGVuZFxuXHRcdC8vIHRoZSBsZW5ndGggb2YgdGhlIGRhdGEgaW4gYml0c1xuXG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCAtemVyb2VzOyArK2opIHtcblx0XHRcdHRhaWwucHVzaCgwKTtcblx0XHR9XG5cblx0XHRjYWxsKGgsIGssIHIsIHRhaWwsIDApO1xuXG5cdFx0emVyb2VzID0gNDQ4IC8gODtcblx0XHR0YWlsID0gW107XG5cdH1cblxuXG5cdC8vIHBhZCB3aXRoIHplcm9lc1xuXHRmb3IgKGxldCBqID0gMDsgaiA8IHplcm9lczsgKytqKSB7XG5cdFx0dGFpbC5wdXNoKDApO1xuXHR9XG5cblx0Ly8gYXBwZW5kIGxlbmd0aCBvZiBtZXNzYWdlIChiZWZvcmUgcHJlcGFyYXRpb24pLCBpbiBiaXRzLFxuXHQvLyBhcyA2NC1iaXQgbGl0dGxlLWVuZGlhbiBpbnRlZ2VyXG5cblx0dGFpbC5wdXNoKChuID4+PiAgMCkgJiAweEZGKTtcblx0dGFpbC5wdXNoKChuID4+PiAgOCkgJiAweEZGKTtcblx0dGFpbC5wdXNoKChuID4+PiAxNikgJiAweEZGKTtcblx0dGFpbC5wdXNoKChuID4+PiAyNCkgJiAweEZGKTtcblx0Ly8gSmF2YVNjcmlwdCB3b3JrcyB3aXRoIDMyIGJpdCBpbnRlZ2Vycy5cblx0Ly8gdGFpbC5wdXNoKChuID4+PiAzMikgJiAweEZGKTtcblx0Ly8gdGFpbC5wdXNoKChuID4+PiA0MCkgJiAweEZGKTtcblx0Ly8gdGFpbC5wdXNoKChuID4+PiA0OCkgJiAweEZGKTtcblx0Ly8gdGFpbC5wdXNoKChuID4+PiA1NikgJiAweEZGKTtcblx0dGFpbC5wdXNoKDApO1xuXHR0YWlsLnB1c2goMCk7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXG5cdGNhbGwoaCwgaywgciwgdGFpbCwgMCk7XG5cblx0ZGlnZXN0WzBdICA9IChoWzBdID4+PiAgMCkgJiAweEZGO1xuXHRkaWdlc3RbMV0gID0gKGhbMF0gPj4+ICA4KSAmIDB4RkY7XG5cdGRpZ2VzdFsyXSAgPSAoaFswXSA+Pj4gMTYpICYgMHhGRjtcblx0ZGlnZXN0WzNdICA9IChoWzBdID4+PiAyNCkgJiAweEZGO1xuXHRkaWdlc3RbNF0gID0gKGhbMV0gPj4+ICAwKSAmIDB4RkY7XG5cdGRpZ2VzdFs1XSAgPSAoaFsxXSA+Pj4gIDgpICYgMHhGRjtcblx0ZGlnZXN0WzZdICA9IChoWzFdID4+PiAxNikgJiAweEZGO1xuXHRkaWdlc3RbN10gID0gKGhbMV0gPj4+IDI0KSAmIDB4RkY7XG5cdGRpZ2VzdFs4XSAgPSAoaFsyXSA+Pj4gIDApICYgMHhGRjtcblx0ZGlnZXN0WzldICA9IChoWzJdID4+PiAgOCkgJiAweEZGO1xuXHRkaWdlc3RbMTBdID0gKGhbMl0gPj4+IDE2KSAmIDB4RkY7XG5cdGRpZ2VzdFsxMV0gPSAoaFsyXSA+Pj4gMjQpICYgMHhGRjtcblx0ZGlnZXN0WzEyXSA9IChoWzNdID4+PiAgMCkgJiAweEZGO1xuXHRkaWdlc3RbMTNdID0gKGhbM10gPj4+ICA4KSAmIDB4RkY7XG5cdGRpZ2VzdFsxNF0gPSAoaFszXSA+Pj4gMTYpICYgMHhGRjtcblx0ZGlnZXN0WzE1XSA9IChoWzNdID4+PiAyNCkgJiAweEZGO1xuXG5cdHJldHVybiBkaWdlc3Q7XG5cbn1cbiJdfQ==