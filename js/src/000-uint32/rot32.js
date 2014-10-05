
/**
 * Left rotate for 32-bit unsigned integers
 *
 *  - used in md5 and sha1
 */

var rot32 = function (word, shift) {
	return (word << shift) | (word >>> (32 - shift));
};

exports.rot32 = rot32;
