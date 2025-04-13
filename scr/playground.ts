import { ddtostring } from './conv-dd.js';

let result = ddtostring(42, 0.195);
console.log(result.join(''));

export function sampleAdd(a: number, b: number) {
	return a + b;
}
