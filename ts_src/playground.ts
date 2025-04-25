
function consStr(input: string): [string|undefined,string|undefined] {
	if (input.length == 0) {
		return [undefined, undefined];
	}else if(input.length == 1) {
		return [input, undefined];
	}else{
		throw new Error('Not implemented')
	}
}

let str="1020";
console.log(str.substring(0,1), str.substring(1));
console.log(str.slice(0,1));

