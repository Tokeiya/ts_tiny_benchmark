console.log(twoProduct(6.929001713869936e236, 2.5944475251952003e71));

function split(value: number): [number, number] {
	let tmp = value * (2 ** 27 + 1);
	let x = tmp - (tmp - value);
	let y = value - x;
	return [x, y];
}

function twoProduct(a: number, b: number): [number, number] {
	let x = a * b;
	let y = 0;
	let an = 0;
	let bn = 0;

	if (Math.abs(a) > 2 ** 996) {
		an = a * 2 ** -28;
		bn = b * 2 ** 28;
	} else if (Math.abs(b) > 2 ** 996) {
		an = a * 2 ** 28;
		bn = b * 2 ** -28;
	} else {
		an = a;
		bn = b;
	}

	const [a1, a2] = split(an);
	const [b1, b2] = split(bn);

	if (Math.abs(x) > 2 ** 1023) {
		y = (a1 * 0.5 * b1 - x * 0.5) * 2 + a2 * b1 + a1 * b2 + a2 * b2;
	} else {
		y = a1 * b1 - x + a2 * b1 + a1 * b2 + a2 * b2;
	}

	return [x, y];
}
