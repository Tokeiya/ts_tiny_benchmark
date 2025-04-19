import { ldexp } from './share.js';
import { Dequeue } from '../dequeue.js';
import { Format } from './format.js';
import { Mode } from './mode.js';

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
}
