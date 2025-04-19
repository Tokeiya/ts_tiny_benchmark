import { expect, test } from 'vitest';
import { DoubleDouble } from '../ts_scr/dd/doubleDouble.js';

test('DoubleDouble constructor', () => {
	const dd = new DoubleDouble(1.0, 2.0);
	expect(dd.a1).toBe(1.0);
	expect(dd.a2).toBe(2.0);
});

test('DoubleDouble positive fromNumbers', () => {
	const dd = DoubleDouble.fromNumbers(1.0);
	expect(dd.a1).toBe(1.0);
	expect(dd.a2).toBe(0.0);
});

test('DoubleDouble negative fromNumbers', () => {
	const dd = DoubleDouble.fromNumbers(-1.0);
	expect(dd.a1).toBe(-1.0);
	expect(dd.a2).toBe(0.0);
});

test('DoubleDouble positive fromBigint', () => {
	const dd = DoubleDouble.fromBigint(9223372036854775807n);
	let a = BigInt(dd.a1);
	let b = BigInt(dd.a2);

	expect(a + b).toBe(9223372036854775807n);
});

test('DoubleDouble negative fromBigint', () => {
	const dd = DoubleDouble.fromBigint(-9223372036854775807n);
	let a = BigInt(dd.a1);
	let b = BigInt(dd.a2);

	expect(a + b).toBe(-9223372036854775807n);
});

test('DoubleDouble add', () => {
	const dd1 = new DoubleDouble(1.0, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.add(dd2);
	expect(result.a1).toBe(4.0);
});

test('DoubleDouble NaN add', () => {
	const dd1 = new DoubleDouble(NaN, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.add(dd2);
	expect(result.a1).toBeNaN();
	expect(result.a2).toBeNaN();
});

test('DoubleDouble Inf add', () => {
	const dd1 = new DoubleDouble(Infinity, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.add(dd2);
	expect(result.a1).toBe(Infinity);
	expect(result.a2).toBe(0);
});

test('DoubleDouble sub', () => {
	const dd1 = new DoubleDouble(5.0, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.sub(dd2);
	expect(result.a1).toBe(2.0);
});

test('DoubleDouble NaN sub', () => {
	const dd1 = new DoubleDouble(NaN, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.sub(dd2);
	expect(result.a1).toBeNaN();
	expect(result.a2).toBeNaN();
});

test('DoubleDouble Inf sub', () => {
	const dd1 = new DoubleDouble(Infinity, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.sub(dd2);
	expect(result.a1).toBe(Infinity);
	expect(result.a2).toBe(0);
});

test('DoubleDouble mul', () => {
	const dd1 = new DoubleDouble(2.0, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.mul(dd2);
	expect(result.a1).toBe(6.0);
});

test('DoubleDouble NaN mul', () => {
	const dd1 = new DoubleDouble(NaN, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.mul(dd2);
	expect(result.a1).toBeNaN();
	expect(result.a2).toBeNaN();
});

test('DoubleDouble Inf mul', () => {
	const dd1 = new DoubleDouble(Infinity, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.mul(dd2);
	expect(result.a1).toBe(Infinity);
	expect(result.a2).toBe(0);
});

test('DoubleDouble div', () => {
	const dd1 = new DoubleDouble(6.0, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.div(dd2);
	expect(result.a1).toBe(2.0);
});

test('DoubleDouble NaN div', () => {
	const dd1 = new DoubleDouble(NaN, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.div(dd2);
	expect(result.a1).toBeNaN();
	expect(result.a2).toBeNaN();
});

test('DoubleDouble Inf div', () => {
	const dd1 = new DoubleDouble(Infinity, 0);
	const dd2 = new DoubleDouble(3.0, 0);
	const result = dd1.div(dd2);
	expect(result.a1).toBe(Infinity);
	expect(result.a2).toBe(0);
});

test('DoubleDouble toString', () => {
	const dd = new DoubleDouble(1.0, 2.0);
	expect(dd.toString()).toBe('3.0');
});
