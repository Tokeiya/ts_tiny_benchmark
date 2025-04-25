import { ldexp } from './share.js';
import { Dequeue } from '../dequeue.js';
import { Format } from './format.js';
import { Mode } from './mode.js';
import { ParseError } from '../error/parseError';

export class DoubleDouble {
	public readonly a1: number;
	public readonly a2: number;

	public constructor(a1: number, a2: number) {
		this.a1 = a1;
		this.a2 = a2;
	}

	public static fromNumbers(value: number): DoubleDouble {
		return new DoubleDouble(value, 0);
	}

	public static fromBigint(value: bigint): DoubleDouble {
		const a1 = Number(value);
		const a2 = value - BigInt(a1);
		return new DoubleDouble(a1, Number(a2));
	}

	public static doubleDoubleToString(
		x1: number,
		x2: number,
		precision: bigint = 34n,
		format: Format = Format.General,
		mode: Mode = Mode.Nearest,
	): string[] {
		let i: bigint = 0n;
		let sign: bigint = 0n;
		let sign2: bigint = 0n;
		let ex1: bigint = 0n;
		let ex2: bigint = 0n;
		let absx1: number = 0;
		let absx2: number = 0;

		if (x1 != x1 || x2 != x2) return ['nan'];

		sign = DoubleDouble.get_sign_double(x1);
		absx1 = Math.abs(x1);

		if (absx1 == 0) {
			if (sign == -1n) {
				return ['-0'];
			} else {
				return ['0'];
			}
		}

		if (DoubleDouble.isInfinite(absx1)) {
			if (sign == -1n) {
				return ['-inf'];
			} else {
				return ['inf'];
			}
		}

		// get x1 to buf

		ex1 = DoubleDouble.getExponent(absx1);

		// add 1-byte margin to add buf2

		const buf: bigint[] = new Array(1023 - -1074 + 2).fill(0n);

		const offset = 1074n;
		let emax: bigint = 0n;
		let emin: bigint = 0n;
		let dtmp: number;
		let dtmp2: number;

		dtmp = absx1;
		dtmp2 = DoubleDouble.ldexp(1, Number(ex1));

		for (i = 0n; i <= 52n; i++) {
			if (dtmp >= dtmp2) {
				buf[Number(offset + ex1 - i)] = 1n;
				dtmp -= dtmp2;
			} else {
				buf[Number(offset + ex1 - i)] = 0n;
			}
			if (dtmp == 0) {
				emax = ex1;
				emin = ex1 - i;
				break;
			}
			dtmp2 /= 2;
		}

		// get x2 to buf2 and add it to buf

		const buf2: bigint[] = new Array(1023 - -1074 + 1).fill(0n);
		let emax2: bigint = 0n;
		let emin2: bigint = 0n;
		let s: bigint = 0n;
		let carry: bigint = 0n;
		let tmp: bigint = 0n;

		sign2 = DoubleDouble.get_sign_double(x2);
		absx2 = Math.abs(x2);

		if (absx2 != 0) {
			ex2 = DoubleDouble.getExponent(absx2);
			dtmp = absx2;
			dtmp2 = DoubleDouble.ldexp(1, Number(ex2));

			for (i = 0n; i <= 52n; i++) {
				if (dtmp >= dtmp2) {
					buf2[Number(offset + ex2 - i)] = 1n;
					dtmp -= dtmp2;
				} else {
					buf2[Number(offset + ex2 - i)] = 0n;
				}
				if (dtmp == 0) {
					emax2 = ex2;
					emin2 = ex2 - i;
					break;
				}
				dtmp2 /= 2;
			}

			if (sign == sign2) s = 1n;
			else s = -1n;

			if (emin > emin2) {
				for (i = emin2; i <= emin - 1n; i++) {
					buf[Number(offset + i)] = 0n;
				}
				emin = emin2;
			}
			emax++;
			buf[Number(offset + emax)] = 0n;

			carry = 0n;
			for (i = emin2; i <= emax2; i++) {
				// NOTICE: tmp may become negative
				tmp = buf[Number(offset + i)] + s * buf2[Number(offset + i)] + carry;
				//carry = (int)std::floor(tmp / 2.);
				carry = BigInt(Math.floor(Number(tmp) / 2));
				buf[Number(offset + i)] = tmp - carry * 2n;
			}
			for (i = emax2 + 1n; i <= emax; i++) {
				if (carry == 0n) break;
				// NOTICE: tmp may become negative
				tmp = buf[Number(offset + i)] + carry;
				//carry = (int)std::floor(tmp / 2.);
				carry = BigInt(Math.floor(Number(tmp) / 2));
				buf[Number(offset + i)] = tmp - carry * 2n;
			}
			while (buf[Number(offset + emax)] == 0n) {
				emax--;
			}
		}

		if (emin > 0n) {
			for (i = 0n; i < emin; i++) {
				buf[Number(offset + i)] = 0n;
			}
			emin = 0n;
		}

		if (emax < 0n) {
			for (i = emax + 1n; i <= 0; i++) {
				buf[Number(offset + i)] = 0n;
			}
			emax = 0n;
		}

		//std::list<int> result1, result2;
		const result1: Dequeue<bigint> = new Dequeue<bigint>();
		const result2: Dequeue<bigint> = new Dequeue<bigint>();

		let result_max: bigint;
		let result_min: bigint;
		let m: bigint = 0n;
		let pm: bigint = 0n;

		result_max = -1n;

		while (emax >= 0) {
			if (emax >= 17n) m = 5n;
			else if (emax >= 14n) m = 4n;
			else if (emax >= 10n) m = 3n;
			else if (emax >= 7n) m = 2n;
			else m = 1n;

			pm = 1n;
			for (i = 0n; i < m; i++) pm *= 10n;

			carry = 0n;
			for (i = emax; i >= 0; i--) {
				tmp = carry * 2n + buf[Number(offset + i)];
				buf[Number(offset + i)] = tmp / pm;
				carry = tmp % pm;
			}

			for (i = 0n; i < m; i++) {
				result_max++;
				result1.push(carry % 10n);
				carry /= 10n;
			}

			while (emax >= 0 && buf[Number(offset + emax)] == 0n) {
				emax--;
			}
		}

		result_min = 0n;

		while (emin < 0) {
			m = DoubleDouble.min(8n, -emin);
			pm = 1n;
			for (i = 0n; i < m; i++) pm *= 10n;

			carry = 0n;
			for (i = emin; i <= -1; i++) {
				tmp = buf[Number(offset + i)] * pm + carry;
				buf[Number(offset + i)] = tmp % 2n;
				carry = tmp / 2n;
			}

			for (i = 0n; i < m; i++) {
				result_min--;
				pm /= 10n;
				result2.push(carry / pm);
				carry %= pm;
			}

			while (emin < 0 && buf[Number(offset + emin)] == 0n) {
				emin++;
			}
		}

		//let buf2:bigint[] = new Array(1023 - (-1074) + 1).fill(0n);
		const result: bigint[] = new Array(
			Number(result_max - result_min + 1n + 2n),
		).fill(0n);

		function error(): bigint {
			throw new Error();
		}

		// add 1byte margin to both ends of array
		//result.resize(result_max - result_min + 1 + 2);
		const offset2: bigint = -result_min + 1n;
		for (i = 0n; i <= result_max; i++) {
			result[Number(offset2 + i)] = result1.get_value(0) ?? error();
			result1.shift();
		}
		for (i = -1n; i >= result_min; i--) {
			result[Number(offset2 + i)] = result2.get_value(0) ?? error();
			result2.shift();
		}

		//std::ostringstream result_str;
		const result_str: string[] = [];

		if (sign == 1n) {
			result_str.push('');
		} else {
			result_str.push('-');
		}

		if (format == 'f') {
			// round to precision after decimal point
			if (-(precision + 1n) >= result_min) {
				result_min = -precision;
				tmp = result[Number(offset2 + result_min - 1n)];
				if (
					(mode == Mode.Up && sign == 1n) ||
					(mode == Mode.Down && sign == -1n) ||
					(mode == Mode.Nearest && tmp >= 5)
				) {
					result[Number(offset2 + result_max + 1n)] = 0n;
					result_max++;
					for (i = result_min; i <= result_max; i++) {
						result[Number(offset2 + i)]++;
						if (result[Number(offset2 + i)] != 10n) break;
						result[Number(offset2 + i)] = 0n;
					}
					if (result[Number(offset2 + result_max)] == 0n) {
						result_max--;
					}
				}
			}

			// delete zeros of tail
			while (result_min < 0 && result[Number(offset2 + result_min)] == 0n) {
				result_min++;
			}

			// make result string
			for (i = result_max; i >= result_min; i--) {
				if (i == -1n) result_str.push('.');
				result_str.push(result[Number(offset2 + i)].toString());
			}
		} else if (format == Format.Exponential) {
			// delete zeros of head
			while (result[Number(offset2 + result_max)] == 0n) {
				result_max--;
			}

			// round to precision
			if (result_max - precision - 1n >= result_min) {
				result_min = result_max - precision;
				tmp = result[Number(offset2 + result_min - 1n)];
				if (
					(mode == Mode.Up && sign == 1n) ||
					(mode == Mode.Down && sign == -1n) ||
					(mode == Mode.Nearest && tmp >= 5n)
				) {
					result[Number(offset2 + result_max + 1n)] = 0n;
					result_max++;
					for (i = result_min; i <= result_max; i++) {
						result[Number(offset2 + i)]++;
						if (result[Number(offset2 + i)] != 10n) break;
						result[Number(offset2 + i)] = 0n;
					}
					if (result[Number(offset2 + result_max)] == 0n) {
						result_max--;
					} else {
						result_min++;
					}
				}
			}

			// delete zeros of tail
			while (result[Number(offset2 + result_min)] == 0n) {
				result_min++;
			}

			// make result string
			for (i = result_max; i >= result_min; i--) {
				if (i == result_max - 1n) result_str.push('.');
				result_str.push(result[Number(offset2 + i)].toString());
			}
			// sprintf(stmp, "e%+03d", result_max);
			result_str.push('e');
			result_str.push(result_max.toString());
		} else if (format == Format.General) {
			// delete zeros of head
			while (result[Number(offset2 + result_max)] == 0n) {
				result_max--;
			}

			// round to precision
			if (result_max - precision >= result_min) {
				result_min = result_max - precision + 1n;
				tmp = result[Number(offset2 + result_min - 1n)];
				if (
					(mode == Mode.Up && sign == 1n) ||
					(mode == Mode.Down && sign == -1n) ||
					(mode == Mode.Nearest && tmp >= 5n)
				) {
					result[Number(offset2 + result_max + 1n)] = 0n;
					result_max++;
					for (i = result_min; i <= result_max; i++) {
						result[Number(offset2 + i)]++;
						if (result[Number(offset2 + i)] != 10n) break;
						result[Number(offset2 + i)] = 0n;
					}
					if (result[Number(offset2 + result_max)] == 0n) {
						result_max--;
					} else {
						result_min++;
					}
				}
			}

			if (-4n <= result_max && result_max <= precision - 1n) {
				// use 'f' like format

				// delete zeros of tail
				while (result_min < 0n && result[Number(offset2 + result_min)] == 0n) {
					result_min++;
				}

				if (result_max < 0n) {
					result_max = 0n;
				}

				// make result string
				for (i = result_max; i >= result_min; i--) {
					if (i == -1n) result_str.push('.');
					result_str.push(result[Number(offset2 + i)].toString());
				}
			} else {
				// use 'e' like format

				// delete zeros of tail
				while (result[Number(offset2 + result_min)] == 0n) {
					result_min++;
				}

				// make result string
				for (i = result_max; i >= result_min; i--) {
					if (i == result_max - 1n) result_str.push('.');
					result_str.push(result[Number(offset2 + i)].toString());
				}
				// sprintf(stmp, "e%+03d", result_max);
				result_str.push('e');
				result_str.push(result_max.toString());
			}
		} else if (format == Format.All) {
			// make result string
			for (i = result_max; i >= result_min; i--) {
				if (i == -1n) result_str.push('.');
				result_str.push(result[Number(offset2 + i)].toString());
			}
		}

		return result_str;
	}

	private static min(a: bigint, b: bigint): bigint {
		if (a < b) return a;
		else return b;
	}

	private static get_sign_double(x: number): bigint {
		if (x == 0) {
			x = 1 / x;
		}

		if (x > 0) return 1n;
		else return -1n;
	}

	private static ldexp(mantissa: number, exponent: number): number {
		return mantissa * Math.pow(2, exponent);
	}

	private static getExponent(x: number): bigint {
		// Perform boundary checks similar to the original C++ approach
		if (x >= Math.pow(2, 1023)) return 1023n;
		if (x < Math.pow(2, -1074)) return -1075n;

		// Use absolute value for exponent calculation
		const absX = Math.abs(x);

		// Compute exponent using log2, then shift to match the behavior of std::frexp
		const exponent = BigInt(Math.floor(Math.log2(absX)) + 1);
		return exponent - 1n;
	}

	private static twoSum(a: number, b: number): [number, number] {
		const x = a + b;
		let tmp;
		let y;

		if (Math.abs(a) > Math.abs(b)) {
			tmp = x - a;
			y = b - tmp;
		} else {
			tmp = x - b;
			y = a - tmp;
		}

		return [x, y];
	}

	private static twoProduct(a: number, b: number): [number, number] {
		const th = ldexp(1, 996);
		const c1 = ldexp(1, -28);
		const c2 = ldexp(1, 28);
		const th2 = ldexp(1, 1023);

		//		double na, nb, a1, a2, b1, b2;

		const x = a * b;

		if (!Number.isFinite(a)) {
			return [x, 0];
		}

		let na;
		let nb;

		if (Math.abs(a) > th) {
			na = a * c1;
			nb = b * c2;
		} else if (Math.abs(b) > th) {
			na = a * c2;
			nb = b * c1;
		} else {
			na = a;
			nb = b;
		}

		const [a1, a2] = DoubleDouble.split(na);
		const [b1, b2] = DoubleDouble.split(nb);

		let y;
		if (Math.abs(x) > th2) {
			y = (a1 * 0.5 * b1 - x * 0.5) * 2 + a2 * b1 + a1 * b2 + a2 * b2;
		} else {
			y = a1 * b1 - x + a2 * b1 + a1 * b2 + a2 * b2;
		}

		return [x, y];
	}

	private static split(a: number): [number, number] {
		const sigma = (1 << 27) + 1;

		const tmp = a * sigma;
		const x = tmp - (tmp - a);
		const y = a - x;

		return [x, y];
	}

	private static isInfinite(value: number): boolean {
		return Math.abs(value) == Infinity;
	}

	public add(other: DoubleDouble): DoubleDouble {
		//double z1, z2, z3, z4;

		const [z1, _z2] = DoubleDouble.twoSum(this.a1, other.a1);
		let z2 = _z2;

		if (DoubleDouble.isInfinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		z2 += this.a2 + other.a2;
		const [z3, z4] = DoubleDouble.twoSum(z1, z2);

		if (DoubleDouble.isInfinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public sub(other: DoubleDouble): DoubleDouble {
		const [z1, _z2] = DoubleDouble.twoSum(this.a1, -other.a1);
		let z2 = _z2;

		if (DoubleDouble.isInfinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		z2 += this.a2 - other.a2;
		const [z3, z4] = DoubleDouble.twoSum(z1, z2);

		if (DoubleDouble.isInfinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public mul(other: DoubleDouble): DoubleDouble {
		//double z1, z2, z3, z4;

		const [z1, _z2] = DoubleDouble.twoProduct(this.a1, other.a1);
		let z2 = _z2;

		if (DoubleDouble.isInfinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		// x.a2 * y.a2 is very small but sometimes important
		z2 += this.a1 * other.a2 + this.a2 * other.a1;
		z2 += this.a1 * other.a2 + this.a2 * other.a1 + this.a2 * other.a2;

		const [z3, z4] = DoubleDouble.twoSum(z1, z2);
		if (DoubleDouble.isInfinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public div(other: DoubleDouble): DoubleDouble {
		let z2 = 0.0;

		const z1 = this.a1 / other.a1;
		if (DoubleDouble.isInfinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		if (DoubleDouble.isInfinite(other.a1)) {
			return new DoubleDouble(z1, 0);
		}

		let [z3, z4] = DoubleDouble.twoProduct(-z1, other.a1);
		if (DoubleDouble.isInfinite(z3)) {
			[z3, z4] = DoubleDouble.twoProduct(-z1, other.a1 * 0.5);
			z2 =
				(z3 + this.a1 * 0.5 - z1 * (other.a2 * 0.5) + this.a2 * 0.5 + z4) /
				(other.a1 * 0.5);
		} else {
			z2 = (z3 + this.a1 - z1 * other.a2 + this.a2 + z4) / other.a1;
		}

		[z3, z4] = DoubleDouble.twoSum(z1, z2);
		if (DoubleDouble.isInfinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public toString(): string {
		const str = DoubleDouble.doubleDoubleToString(
			this.a1,
			this.a2,
			34n,
			Format.General,
			Mode.Nearest,
		);
		return str.join('');
	}

	public formatToString(): string {
		throw new Error();
	}

	public parse(source:string,mode:bigint,fast:boolean):[x1:number,x2:number]{
		throw new Error('Not implemented')
	}

	public static get_sign(input:string):[bigint,string]{
		if(input.length==0)
		{
			throw new ParseError('""')
		}



	}

	public static get_number(input:string):[string,string]{
		throw new Error('Not implemented')
	}

// 	public static stringtodd(s:string,  mode:bigint = 0n,  fast:boolean = false):[x1:number,x2:number] {
// 		let i:bigint=0n;
// 		let tmp:bigint=0n;
//
// 		let flag:boolean=false;
//
// 		let sign:bigint=0n;
// 		let e10:bigint=0n;
// 		let esign:bigint=0n;
//
// 		let num1_s:string, num2_s:string, nume_s:string;
//
// 		//Unmannerd :)
// 		s=s.trim();
//
// 	sign = get_sign(s);
// 	num1_s = get_number(s);
//
// 	if (0 < s.size() && s[0] == '.') {
// 	s = s.substr(1);
// 	num2_s = get_number(s);
// }
//
// if (0 < s.size() && (s[0] == 'e' || s[0] == 'E')) {
// 	s = s.substr(1);
// 	esign = get_sign(s);
// 	nume_s = get_number(s);
// 	e10 = esign * atoi(nume_s.c_str());
// } else {
// 	e10 = 0;
// }
//
// // delete 0s from the head of num1_s
// while (0 < num1_s.size() && num1_s[0] == '0') {
// 	num1_s = num1_s.substr(1);
// }
//
// // delete 0s from the tail of num2_s
// while (0 < num2_s.size() && num2_s[num2_s.size() - 1] == '0') {
// 	num2_s = num2_s.substr(0, num2_s.size() - 1);
// }
//
// // set table and offset
// // |x| = \sum_{table_min}^{table_max} table[offset + i] * 10^i
// int table_max, table_min, offset;
// std::vector<int> table;
//
// table_max = num1_s.size() - 1 + e10;
// table_min = e10 - num2_s.size();
// table.resize(table_max - table_min + 1);
// offset = - table_min;
//
// for (i=0; i<num1_s.size(); i++) {
// 	table[offset + num1_s.size() - 1 - i + e10] = num1_s[i] - '0';
// }
//
// for (i=0; i<num2_s.size(); i++) {
// 	table[offset - i - 1 + e10] = num2_s[i] - '0';
// }
//
// // extend table
// if (table_min > 0) {
// 	tmp = table.size();
// 	table.resize(tmp + table_min);
// 	for (i=tmp-1; i>=0; i--) {
// 		table[i + table_min] = table[i];
// 	}
// 	for (i=0; i<table_min; i++) {
// 		table[i] = 0;
// 	}
// 	offset += table_min;
// 	table_min = 0;
// }
//
// if (table_max < -1) {
// 	tmp = table.size();
// 	table.resize(tmp + (-1-table_max));
// 	for (i=0; i<(-1-table_max); i++) {
// 		table[tmp + i] = 0;
// 	}
// 	table_max = -1;
// }
//
// #if 0
// for (i=table_max; i>=table_min; i--) {
// 	std::cout << i << ':' << table[offset + i] << "\n";
// }
// #endif
//
// // convert decimal number to binary number
// // set result and offset2
// // |x| = \sum_{result_min}^{reuslt_max} result[offset2 + i] * 2^i
//
// int result_min, result_max, m, pm, carry, carry2;
// std::list<bool> result1, result2;
//
// // integer part
//
// result_max = -1;
//
// while (table_max >= 0) {
// 	if (table_max >= 5) m = 16;
// 	else if (table_max >= 4) m = 13;
// 	else if (table_max >= 3) m = 9;
// 	else if (table_max >= 2) m = 6;
// 	else if (table_max >= 1) m = 3;
// 	else m = 1;
// 	pm = 1 << m;
//
// 	carry = 0;
// 	for (i=table_max; i>=0; i--) {
// 		tmp = carry * 10 + table[offset + i];
// 		table[offset + i] = tmp / pm;
// 		carry = tmp % pm;
// 	}
// 	for (i=0; i<m; i++) {
// 		result_max++;
// 		result1.push_back(carry % 2);
// 		carry = carry / 2;
// 	}
// 	while (table_max >= 0 && table[offset + table_max] == 0) {
// 		table_max--;
// 	}
// }
//
// // fraction part
//
// //  flag means whether most significant bit already found or not
// if (result_max >= 0) flag = true;
// else flag = false;
//
// result_min = 0;
//
// while (table_min < 0) {
// 	if (fast) {
// 		tmp = 106 - (result_max - result_min);
// 	} else {
// 		tmp = result_min + 1075;
// 	}
// 	if (flag && tmp <= 0) break;
// 	if (!flag) {
// 		m = 16;
// 	} else {
// 		m = std::min(16, tmp);
// 	}
// 	pm = 1 << m;
//
// 	carry = 0;
// 	for (i=table_min; i<=-1; i++) {
// 		tmp = table[offset + i] * pm + carry;
// 		table[offset + i] = tmp % 10;
// 		carry = tmp / 10;
// 	}
//
// 	for (i=0; i<m; i++) {
// 		result_min--;
// 		pm /= 2;
// 		carry2 = carry / pm;
// 		carry = carry % pm;
//
// 		if (flag) {
// 			result2.push_back(carry2);
// 		} else {
// 			if (carry2 != 0) {
// 				result2.push_back(carry2);
// 				result_max = result_min;
// 				flag = true;
// 			}
// 		}
// 	}
//
// 	while (table_min < 0 && table[offset + table_min] == 0) {
// 		table_min++;
// 	}
// }
//
// // append integer and fraction part
//
// std::vector<bool> result;
// int offset2;
//
// result.resize(result_max - result_min + 1);
// offset2 = - result_min;
// for (i=0; i<=result_max; i++) {
// 	result[offset2 + i] = result1.front();
// 	result1.pop_front();
// }
// for (i=std::min(-1, result_max); i>=result_min; i--) {
// 	result[offset2 + i] = result2.front();
// 	result2.pop_front();
// }
//
// #if 0
// for (i=result_max; i>=result_min; i--) {
// 	printf("%d %d\n", i, result[offset2 + i]);
// }
// #endif
//
// // convert binary to double double number
//
// double dtmp;
//
// if (result_max > 1023) {
// 	if ((sign == 1 && mode == -1) || (sign == -1 && mode == 1)) {
// 		x1 = sign * (std::numeric_limits<double>::max)();
// 		x2 = std::ldexp(x1, -54);
// 		return;
// 	}
// 	dtmp = sign * std::numeric_limits<double>::infinity();
// 	x1 = dtmp;
// 	x2 = dtmp;
// 	return;
// }
//
// if (result_max < -1075) {
// 	if ((sign == 1 && mode == 1) || (sign == -1 && mode == -1)) {
// 		x1 = sign * std::numeric_limits<double>::denorm_min();
// 		x2 = sign * 0.;
// 		return;
// 	}
// 	dtmp = sign * 0.;
// 	x1 = dtmp;
// 	x2 = dtmp;
// 	return;
// }
//
// double r, r2;
// int result_max2;
// int msb;
//
// r = 0.;
// flag = false; // roundup first part or not
// result_max2 = result_min - 1;
// for (i=result_max; i >= result_min; i--) {
// 	if (result_max - i == 53 || i == -1075) {
// 		if (sign == 1) {
// 			if (result[offset2 + i] == 0) {
// 			} else {
// 				r += std::ldexp(1., i+1);
// 				flag = true;
// 			}
// 		} else {
// 			if (result[offset2 + i] == 0) {
// 			} else {
// 				r += std::ldexp(1., i+1);
// 				flag = true;
// 			}
// 		}
// 		result_max2 = i;
// 		break;
// 	}
// 	r += std::ldexp((double)result[offset2 + i], i);
// }
//
// if (flag) {
// 	r2 = - std::ldexp(1., result_max2 + 1);
// } else {
// 	r2 = 0.;
// }
//
// msb = result_min - 1; // outside result bits
//
// for (i=result_max2; i >= result_min; i--) {
// 	if (fast) {
// 		tmp = result_max2 - i;
// 	} else {
// 		tmp = msb - i;
// 	}
// 	if (tmp == 53 || i == -1075) {
// 		if (sign == 1) {
// 			if (mode == -1) {
// 			} else if (mode == 0) {
// 				if (result[offset2 + i] == 0) {
// 				} else {
// 					r2 += std::ldexp(1., i+1);
// 				}
// 			} else {
// 				r2 += std::ldexp(1., i+1);
// 			}
// 		} else {
// 			if (mode == -1) {
// 				r2 += std::ldexp(1., i+1);
// 			} else if (mode == 0) {
// 				if (result[offset2 + i] == 0) {
// 				} else {
// 					r2 += std::ldexp(1., i+1);
// 				}
// 			} else {
// 			}
// 		}
// 		break;
// 	}
// 	tmp = result[offset2 + i];
// 	r2 += std::ldexp((double)tmp, i);
// 	if (msb == result_min - 1 && ((flag && tmp == 0) || (!flag && tmp == 1))) {
// 		msb = i;
// 	}
// }
//
// x1 = sign * r;
// x2 = sign * r2;
// return;
// }
}
