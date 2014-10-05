
var sh64 = function (a, s) {
	return [a[0] >>> s, (a[0] << (32-s)) | (a[1] >>> s)];
};

exports.sh64 = sh64;
