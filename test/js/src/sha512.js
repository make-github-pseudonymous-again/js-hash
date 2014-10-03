test("sha512", function () {

	console.log("==================== SHA512 =====================");

	var a = "The quick brown fox jumps over the lazy dog",
		b = "The quick brown fox jumps over the lazy dog.",
		c = "",
		d = "abc",
		e = "abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu",

		w0 = "0x07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6",
		w1 = "0x91ea1245f20d46ae9a037a989f54f1f790f0a47607eeb8a14d12890cea77a1bbc6c7ed9cf205e67b7f2b8fd4c7dfd3a7a8617e45f3c463d481c7e586c39ac1ed",
		w2 = "0xcf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e",
		w3 = "0xddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
		w4 = "0x8e959b75dae313da8cf4f72814fc143f8f7779c6eb9f7fa17299aeadb6889018501d289e4900f7e4331b99dec4b5433ac7d329eeb6dd26545e96e55b874be909",

		h0 = hash.sha512(a),
		h1 = hash.sha512(b),
		h2 = hash.sha512(c),
		h3 = hash.sha512(d),
		h4 = hash.sha512(e);

	deepEqual(h0, w0, a);
	deepEqual(h1, w1, b);
	deepEqual(h2, w2, c);
	deepEqual(h3, w3, d);
	deepEqual(h4, w4, e);

});
