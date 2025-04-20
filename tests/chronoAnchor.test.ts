import { expect, test } from 'vitest';
import { ChronoAnchor } from '../ts_src/chrono/chronoAnchor.js';

test('ChronoAnchor.fromProcessHrtmen', () => {
	const anchor = ChronoAnchor.fromProcessHrtmen(123n, 456);
	expect(anchor.value).toBe(123n);
	expect(anchor.id).toBe(456);
});

test('ChronoAnchor.fromPerformanceNow', () => {
	const anchor = ChronoAnchor.fromPerformanceNow(123.456, 789);
	expect(anchor.value).toBe(123456000n);
	expect(anchor.id).toBe(789);
});

test('ChronoAnchor.fromPerformanceNow with undefined id', () => {
	let anchor = ChronoAnchor.fromPerformanceNow(123.456, undefined);
	expect(anchor.value).toBe(123456000n);
	expect(anchor.id).toBe(undefined);

	anchor = ChronoAnchor.fromPerformanceNow(123, 0);
	expect(anchor.value).toBe(123000000n);
	expect(anchor.id).toBe(0);

	anchor = ChronoAnchor.fromPerformanceNow(123.4567890123, undefined);
	expect(anchor.value).toBe(123456789n);
	expect(anchor.id).toBe(undefined);
});

test('ChronoAnchor.checkId', () => {
	const anchor1 = ChronoAnchor.fromProcessHrtmen(123n, 456);
	const anchor2 = ChronoAnchor.fromProcessHrtmen(789n, 456);
	const anchor3 = ChronoAnchor.fromProcessHrtmen(789n, 999);
	const anchor4 = ChronoAnchor.fromPerformanceNow(123.456, undefined);
	const anchor5 = ChronoAnchor.fromPerformanceNow(123.456, undefined);

	expect(anchor1.checkId(anchor2)).toBe(true);
	expect(anchor1.checkId(anchor3)).toBe(false);
	expect(anchor2.checkId(anchor3)).toBe(false);
	expect(anchor4.checkId(anchor5)).toBe(true);
	expect(anchor1.checkId(anchor4)).toBe(false);
});
