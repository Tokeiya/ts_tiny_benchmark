import { fastToSum, twoSum, split, twoProduct } from '../ts_scr/dd/nearBy.js';
import { expect, test } from 'vitest';

test('simple addition with no rounding error', () => {
	const [x, y] = fastToSum(3.0, 2.0);
	expect(x).toBe(5.0);
	expect(y).toBe(0.0);
});

test('addition with small values', () => {
	const [x, y] = fastToSum(1.0e-15, 1.0);
	expect(x).toBe(1.000000000000001);
	expect(y).toBe(0);
});

test('addition where first value is much larger than second', () => {
	const [x, y] = fastToSum(1.0e15, 1.0);
	expect(x).toBe(1000000000000001);
	expect(y).toBe(0.0); // The small value gets lost due to precision limits
});

test('twoSum a large', () => {
	const [x, y] = twoSum(20, 10);
	expect(x).toBe(30);
	expect(y).toBe(0);
});

test('twoSum b large', () => {
	const [x, y] = twoSum(10, 20);
	expect(x).toBe(30);
	expect(y).toBe(0);
});

test('split', () => {
	const [x, y] = split(1.23456789);
	expect(x).toBe(1.2345678806304932);
	expect(y).toBe(9.3695067260313181e-9);
});

test('twoProduct basic positive', () => {
	const [x, y] = twoProduct(3.0, 2.0);
	expect(x).toBe(6.0);
	expect(y).toBe(0.0);
});

test('twoProduct very small', () => {
	const [x, y] = twoProduct(1.0e-150, 1.0e-150);
	expect(x).toBe(1e-300);
	expect(y).toBe(-1.2468378976830533e-317);
});
