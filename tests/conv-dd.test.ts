import { expect, test } from 'vitest';
import { get_exponent, get_sign_double } from '../scr/conv-dd.js';

test('get_sign_double', () => {
	expect(get_sign_double(0.0)).toBe(1);
	expect(get_sign_double(-0.0)).toBe(-1);

	expect(get_sign_double(Number.MIN_VALUE)).toBe(1);
	expect(get_sign_double(-1.0 * Number.MIN_VALUE)).toBe(-1);

	expect(get_sign_double(Number.NaN)).toBe(-1);
	expect(get_sign_double(-1.0 * Number.NaN)).toBe(-1);

	expect(get_sign_double(Number.NEGATIVE_INFINITY)).toBe(-1);
	expect(get_sign_double(Number.POSITIVE_INFINITY)).toBe(1);

	expect(get_sign_double(1)).toBe(1);
	expect(get_sign_double(-1)).toBe(-1);
});

test('get_exponent', () => {
	expect(get_exponent(0.0)).toBe(-1075);
	expect(get_exponent(Number.POSITIVE_INFINITY)).toBe(1023);
	expect(get_exponent(1.0)).toBe(0);
	expect(get_exponent(Number.MIN_VALUE)).toBe(-1074);
	expect(get_exponent(Number.MAX_VALUE)).toBe(1023);
});
