import { Dequeue } from './dequeue.js';
import { ddtostring } from './conv-dd.js';

let result = ddtostring(10.1, 0.3514);

for (let elem of result) {
	console.log(elem);
}

export function sampleAdd(a: number, b: number) {
	return a + b;
}
