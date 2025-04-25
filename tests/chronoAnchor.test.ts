import { expect, test } from 'vitest';
import {ChronoAnchor} from '../ts_src/chrono/chronoAnchor.js';



test('fromHrtime', () => {
	const anchor = ChronoAnchor.fromHrtime(123456789n);
	expect(anchor.anchor).toBe(123456789n);
})

test('fromPerformance', () => {

	let anchor = ChronoAnchor.fromPerformance(123.456);
	expect(anchor.anchor).toBe(123_456_000n);

	anchor = ChronoAnchor.fromPerformance(123.456789012);
	expect(anchor.anchor).toBe(123_456_789n);
})

