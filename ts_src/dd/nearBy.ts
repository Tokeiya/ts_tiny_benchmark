import { ldexp } from './share.js';
import { isNumberObject } from 'node:util/types';

export function fastToSum(a: number, b: number): [number, number] {
	let x = a + b;
	let tmp = x - a;
	let y = b - tmp;
	return [x, y];
}

export function twoSum(a: number, b: number): [number, number] {
	let x = a + b;
	let tmp: number;
	let y: number;

	if (Math.abs(a) > Math.abs(b)) {
		tmp = x - a;
		y = b - tmp;
	} else {
		tmp = x - b;
		y = a - tmp;
	}

	return [x, y];
}

export function split(a: number): [number, number] {
	let sigma: number = (1 << 27) + 1;
	let tmp: number;

	tmp = a * sigma;
	let x = tmp - (tmp - a);
	let y = a - x;

	return [x, y];
}

export function twoProduct(a: number, b: number): [number, number] {
	const th = ldexp(1, 996);
	const c1 = ldexp(1, -28);
	const c2 = ldexp(1, 28);
	const th2 = ldexp(1, 1023);

	let na: number, nb: number, a1: number, a2: number, b1: number, b2: number;

	let x = a * b;

	if (Math.abs(a) > th) {
		na = a * c1;
		nb = b * c2;
	} else if (Math.abs(b) > th) {
		na = a * c2;
		nb = b * c1;
	} else {
		na = a;
		nb = b;
	}
	[a1, a2] = split(na);
	[b1, b2] = split(nb);

	let y: number;
	if (Math.abs(x) > th2) {
		y = (a1 * 0.5 * b1 - x * 0.5) * 2 + a2 * b1 + a1 * b2 + a2 * b2;
	} else {
		y = a1 * b1 - x + a2 * b1 + a1 * b2 + a2 * b2;
	}

	return [x, y];
}
