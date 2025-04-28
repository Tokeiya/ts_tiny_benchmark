import { expect, test } from 'vitest';
import { DoubleDouble } from '../ts_src/dd/doubleDouble.js';
import { ParseError } from '../ts_src/error/parseError.js';

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
	expect(dd.toString()).toBe('3');
});

test('DoubleDouble toString with NaN', () => {
	const dd = new DoubleDouble(NaN, 2.0);
	expect(dd.toString()).toBe('nan');
});

test('DoubleDouble toString with Infinity', () => {
	const dd = new DoubleDouble(Infinity, 2.0);
	expect(dd.toString()).toBe('inf');
});

test('DoubleDouble toString with negative Infinity', () => {
	const dd = new DoubleDouble(-Infinity, 2.0);
	expect(dd.toString()).toBe('-inf');
});

test('DoubleDouble toString with zero', () => {
	const dd = new DoubleDouble(0, 0);
	expect(dd.toString()).toBe('0');
});

test('DoubleDouble toString with negative zero', () => {
	const dd = new DoubleDouble(-0, 0);
	expect(dd.toString()).toBe('-0');
});

test('DoubleDouble toString with very small values', () => {
	const dd = new DoubleDouble(1.0e-15, 0);
	expect(dd.toString()).toBe('1.000000000000000077705399876661079e-15');
});

test('DoubleDouble toString with very large values', () => {
	const dd = new DoubleDouble(1.0e15, 0);
	expect(dd.toString()).toBe('1000000000000000');
});

test('DoubleDouble.ddstring with NaN', () => {
	let dd = new DoubleDouble(NaN, 2.0);
	let result = DoubleDouble.doubleDoubleToString(dd.a1, dd.a2);
	expect(result.join('')).toBe('nan');

	expect(DoubleDouble.doubleDoubleToString(1.0, NaN).join('')).toBe('nan');
});

test('DoubleDouble.ddstring with Infinity', () => {
	expect(DoubleDouble.doubleDoubleToString(Infinity, 0).join('')).toBe('inf');
});

test('DoubleDouble.ddstring with negative Infinity', () => {
	expect(DoubleDouble.doubleDoubleToString(-Infinity, 0).join('')).toBe('-inf');
});

test('DoubleDouble.ddstring with zero', () => {
	expect(DoubleDouble.doubleDoubleToString(0, 0).join('')).toBe('0');
});

test('DoubleDouble.ddstring with negative zero', () => {
	expect(DoubleDouble.doubleDoubleToString(-0, 0).join('')).toBe('-0');
});

test('DoubleDouble.ddstring with very small values', () => {
	expect(DoubleDouble.doubleDoubleToString(1.0e-15, 0).join('')).toBe(
		'1.000000000000000077705399876661079e-15',
	);
});

test('DoubleDouble toString with very large values', () => {
	expect(DoubleDouble.doubleDoubleToString(1.0e15, 0).join('')).toBe(
		'1000000000000000',
	);
});


test('foo',()=>{
	let act=DoubleDouble.get_sign("12");
	console.log(act)
})


test('get_sign', () => {
	let str="+1020";
	let act=DoubleDouble.get_sign(str)
	expect(act[0]).toBe(1n);
	expect(act[1]).toBe("1020");

	str="-1020";
	act=DoubleDouble.get_sign(str)
	expect(act[0]).toBe(-1n);
	expect(act[1]).toBe("1020");

	str="1020";
	act=DoubleDouble.get_sign(str)
	expect(act[0]).toBe(1n);
	expect(act[1]).toBe("1020");

	expect(()=>DoubleDouble.get_sign("")).toThrow(ParseError)
	});

test('get_number', () => {
	let str="1020";
	let act=DoubleDouble.get_number(str)
	expect(act[0]).toBe('1020');
	expect(act[1]).toBe('');

	str="1020.123";
	act=DoubleDouble.get_number(str)
	expect(act[0]).toBe('1020');
	expect(act[1]).toBe('.123');

	act=DoubleDouble.get_number("a1020.123");
	expect(act[0]).toBe(undefined);
	expect(act[1]).toBe('a1020.123');
});