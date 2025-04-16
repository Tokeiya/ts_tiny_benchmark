import { ddtostring } from './conv-dd.js';

let result = ddtostring(0.125, 0, 10, 'e');
console.log(result.join(''));

export function sampleAdd(a: number, b: number) {
	return a + b;
}
