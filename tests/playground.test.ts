import { expect, test } from 'vitest';
// import { TimeSpan, fromChronoAnchor } from '../scr/chrono/timeSpan.js';
// import { CompareResult } from '../scr/chrono/compareResult.js';
// import { ChronoAnchor } from '../scr/chrono/chronoAnchor.js';

import {add} from "../scr/playground.js"

test('add', () => {
	expect(add(1, 2)).toBe(3);
})
