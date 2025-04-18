import { expect, test } from 'vitest';
import { DoubleDouble } from '../ts_scr/dd/doubleDouble.js';

test('DoubleDouble constructor', () => {
	const dd = new DoubleDouble(1.0, 2.0);
	expect(dd.hi).toBe(1.0);
	expect(dd.lo).toBe(2.0);
});

test('DoubleDouble from_numbers', () => {
	const dd = DoubleDouble.from_numbers(1.0);
	expect(dd.hi).toBe(1.0);
	expect(dd.lo).toBe(0.0);
});

test('DoubleDouble from_bigint', () => {
	const dd = DoubleDouble.from_bigint(9223372036854775807n);
	let a = BigInt(dd.hi);
	let b = BigInt(dd.lo);

	expect(a + b).toBe(9223372036854775807n);
});

test('DoubleDouble add', () => {
	const dd1 = new DoubleDouble(1.0, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.add(dd2);
	expect(result.hi).toBe(4.0);
});

test('DoubleDouble sub', () => {
	const dd1 = new DoubleDouble(5.0, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.sub(dd2);
	expect(result.hi).toBe(2.0);
});

test('DoubleDouble mul', () => {
	const dd1 = new DoubleDouble(2.0, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.mul(dd2);
	expect(result.hi).toBe(6.0);
});

test('DoubleDouble div', () => {
	const dd1 = new DoubleDouble(6.0, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.div(dd2);
	expect(result.hi).toBe(2.0);
});

test('DoubleDouble toString', () => {
	const dd = new DoubleDouble(1.0, 2.0);
	expect(dd.toString()).toBe('3.0');
});
