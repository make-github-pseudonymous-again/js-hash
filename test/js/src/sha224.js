test("sha224", function () {

	console.log("==================== SHA224 =====================");

	var a = "The quick brown fox jumps over the lazy dog",
		b = "The quick brown fox jumps over the lazy dog.",
		c = "",
		d = "abc",
		e = "abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu",

		w0 = "0x730e109bd7a8a32b1cb9d9a09aa2325d2430587ddbc0c38bad911525",
		w1 = "0x619cba8e8e05826e9b8c519c0a5c68f4fb653e8a3d8aa04bb2c8cd4c",
		w2 = "0xd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f",
		w3 = "0x23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7",
		w4 = "0xc97ca9a559850ce97a04a96def6d99a9e0e0e2ab14e6b8df265fc0b3",

		h0 = hash.sha224(a),
		h1 = hash.sha224(b),
		h2 = hash.sha224(c),
		h3 = hash.sha224(d),
		h4 = hash.sha224(e);

	deepEqual(h0, w0, a);
	deepEqual(h1, w1, b);
	deepEqual(h2, w2, c);
	deepEqual(h3, w3, d);
	deepEqual(h4, w4, e);

});
