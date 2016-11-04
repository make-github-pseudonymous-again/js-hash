export const sh64 = (a, s) => [a[0] >>> s, (a[0] << (32-s)) | (a[1] >>> s)];
