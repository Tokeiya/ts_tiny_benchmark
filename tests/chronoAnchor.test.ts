import { expect, test } from 'vitest';
import {ChronoAnchor} from '../ts_src/chrono/chronoAnchor.js';



test('fromHrtime', () => {
	const anchor = ChronoAnchor.fromHrtime(123456789n, 1);
	expect(anchor.anchor).toBe(123456789n);
	expect(anchor.identity).toBe("1");
})

test('fromPerformance', () => {

	let anchor = ChronoAnchor.fromPerformance(123.456, 1);
	expect(anchor.anchor).toBe(123_456_000n);
	expect(anchor.identity).toBe("1");

	anchor = ChronoAnchor.fromPerformance(123.456789012, undefined);
	expect(anchor.anchor).toBe(123_456_789n);
	expect(anchor.identity).toBeUndefined();
})

test('checkIdentity', () => {
	const anchor1 = ChronoAnchor.fromHrtime(123456789n, 1);
	const anchor2 = ChronoAnchor.fromHrtime(123456789n, 1);
	const anchor3 = ChronoAnchor.fromHrtime(123456789n, undefined);
	const anchor4 = ChronoAnchor.fromHrtime(123456789n, undefined);
	const anchor5 = ChronoAnchor.fromHrtime(987654321n, 2);

	expect(anchor1.checkIdentity(anchor2)).toBe(true);
	expect(anchor1.checkIdentity(anchor3)).toBe(false);
	expect(anchor3.checkIdentity(anchor4)).toBe(true);
	expect(anchor1.checkIdentity(anchor5)).toBe(false);

})
