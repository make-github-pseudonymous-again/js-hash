test("sha256", function () {

	console.log("==================== SHA256 =====================");

	var a = "The quick brown fox jumps over the lazy dog",
		b = "The quick brown fox jumps over the lazy dog.",
		c = "",
		d = "abc",
		e = "abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu",

		w0 = "0xd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
		w1 = "0xef537f25c895bfa782526529a9b63d97aa631564d5d789c2b765448c8635fb6c",
		w2 = "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
		w3 = "0xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
		w4 = "0xcf5b16a778af8380036ce59e7b0492370b249b11e8f07a51afac45037afee9d1",

		h0 = hash.sha256(a),
		h1 = hash.sha256(b),
		h2 = hash.sha256(c),
		h3 = hash.sha256(d),
		h4 = hash.sha256(e);

	deepEqual(h0, w0, a);
	deepEqual(h1, w1, b);
	deepEqual(h2, w2, c);
	deepEqual(h3, w3, d);
	deepEqual(h4, w4, e);

});
