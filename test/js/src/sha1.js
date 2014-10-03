test("sha1", function () {

	console.log("===================== SHA1 ======================");
	var a = "The quick brown fox jumps over the lazy dog",
		b = "The quick brown fox jumps over the lazy cog",
		c = "",
		w0 = "0x2fd4e1c67a2d28fced849ee1bb76e7391b93eb12",
		w1 = "0xde9f2c7fd25e1b3afad3e85a0bd17d9b100db4b3",
		w2 = "0xda39a3ee5e6b4b0d3255bfef95601890afd80709";

	var h0 = hash.sha1(a), h1 = hash.sha1(b), h2 = hash.sha1(c);

	deepEqual(h0, w0, a);
	deepEqual(h1, w1, b);
	deepEqual(h2, w2, c);

});
