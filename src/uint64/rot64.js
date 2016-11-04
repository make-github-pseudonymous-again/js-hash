
/**
 * Right rotate for 64-bit unsigned integers
 *
 *  - used in the sha2 family
 */

export function rot64 (a, s) {
	if (s < 32) {
		return [(a[1] << (32-s)) | a[0] >>> s, (a[0] << (32-s)) | (a[1] >>> s)];
	}
	else {
		s -= 32;
		return [(a[0] << (32-s)) | (a[1] >>> s), (a[1] << (32-s)) | a[0] >>> s];
	}
}
