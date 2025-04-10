import { expect, test } from 'vitest';
import { sampleAdd } from '../scr/playground.js';

test('sampleAdd', () => {
	const result = sampleAdd(2, 3);
	expect(result).toBe(5);
});
