export function add64 (a, b) {

	const t = (a[1] >>> 0) + (b[1] >>> 0);
	const u = t & 0xffffffff;
	const c = +(t > 0xffffffff);

	return [(a[0] + b[0] + c) & 0xffffffff, u];

}
