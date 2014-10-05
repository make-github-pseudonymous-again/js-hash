
var add32 = function (a, b) {
	return (a + b) & 0xffffffff;
};

exports.add32 = add32;
