test("sha384", function () {

	console.log("==================== SHA384 =====================");

	var a = "The quick brown fox jumps over the lazy dog",
		b = "The quick brown fox jumps over the lazy dog.",
		c = "",
		d = "abc",
		e = "abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu",

		w0 = "0xca737f1014a48f4c0b6dd43cb177b0afd9e5169367544c494011e3317dbf9a509cb1e5dc1e85a941bbee3d7f2afbc9b1",
		w1 = "0xed892481d8272ca6df370bf706e4d7bc1b5739fa2177aae6c50e946678718fc67a7af2819a021c2fc34e91bdb63409d7",
		w2 = "0x38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b",
		w3 = "0xcb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7",
		w4 = "0x09330c33f71147e83d192fc782cd1b4753111b173b3b05d22fa08086e3b0f712fcc7c71a557e2db966c3e9fa91746039",

		h0 = hash.sha384(a),
		h1 = hash.sha384(b),
		h2 = hash.sha384(c),
		h3 = hash.sha384(d),
		h4 = hash.sha384(e);

	deepEqual(h0, w0, a);
	deepEqual(h1, w1, b);
	deepEqual(h2, w2, c);
	deepEqual(h3, w3, d);
	deepEqual(h4, w4, e);

});
