import { expect, test } from 'vitest';
import { DoubleDouble } from '../scr/double-double.js';


test('DoubleDouble constructor', () => {
	const dd = new DoubleDouble(1, 2);
	expect(dd.hi).toBe(1);
	expect(dd.lo).toBe(2);
});

test('from_number', () => {
	
}