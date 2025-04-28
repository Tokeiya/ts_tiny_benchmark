import {DoubleDouble} from './dd/doubleDouble.js';


const input="123.456";
const regex=/\d*/g;

let result=[...input.matchAll(regex)];
console.log(result);