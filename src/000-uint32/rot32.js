/**
 * Left rotate for 32-bit unsigned integers
 *
 *  - used in md5 and sha1
 */

export function rot32 (word, shift) {
	return (word << shift) | (word >>> (32 - shift));
}
