export function big32 (a, o) {
	return (a[o + 0] << 24) | (a[o + 1] << 16) | (a[o + 2] << 8) | a[o + 3];
}
