import { ldexp } from './share.js';

export class DoubleDouble {
	public readonly a1: number;
	public readonly a2: number;

	public static fromNumbers(value: number): DoubleDouble {
		return new DoubleDouble(value, 0);
	}

	public static fromBigint(value: bigint): DoubleDouble {
		let a1 = Number(value);
		let a2 = value - BigInt(a1);
		return new DoubleDouble(a1, Number(a2));
	}

	public constructor(a1: number, a2: number) {
		this.a1 = a1;
		this.a2 = a2;
	}

	static fasttwosum(a: number, b: number): [number, number] {
		let x = a + b;
		let tmp = x - a;
		let y = b - tmp;
		return [x, y];
	}

	static twosum(a: number, b: number): [number, number] {
		let x = a + b;
		let tmp = 0;
		let y = 0;

		if (Math.abs(a) > Math.abs(b)) {
			tmp = x - a;
			y = b - tmp;
		} else {
			tmp = x - b;
			y = a - tmp;
		}

		return [x, y];
	}

	static twoproduct(a: number, b: number): [number, number] {
		const th = ldexp(1, 996);
		const c1 = ldexp(1, -28);
		const c2 = ldexp(1, 28);
		const th2 = ldexp(1, 1023);

		//		double na, nb, a1, a2, b1, b2;

		let x = a * b;

		if (!Number.isFinite(a)) {
			return [x, 0];
		}

		let na = 0;
		let nb = 0;

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

		let [a1, a2] = DoubleDouble.split(na);
		let [b1, b2] = DoubleDouble.split(nb);

		let y = 0;
		if (Math.abs(x) > th2) {
			y = (a1 * 0.5 * b1 - x * 0.5) * 2 + a2 * b1 + a1 * b2 + a2 * b2;
		} else {
			y = a1 * b1 - x + a2 * b1 + a1 * b2 + a2 * b2;
		}

		return [x, y];
	}

	static split(a: number): [number, number] {
		const sigma = (1 << 27) + 1;

		let tmp = a * sigma;
		let x = tmp - (tmp - a);
		let y = a - x;

		return [x, y];
	}

	public add(other: DoubleDouble): DoubleDouble {
		//double z1, z2, z3, z4;

		let [z1, z2] = DoubleDouble.twosum(this.a1, other.a1);

		if (Number.isNaN(z1) || Number.isNaN(z2)) {
			return new DoubleDouble(NaN, NaN);
		}

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		z2 += this.a2 + other.a2;
		let [z3, z4] = DoubleDouble.twosum(z1, z2);

		if (!Number.isFinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public sub(other: DoubleDouble): DoubleDouble {
		let [z1, z2] = DoubleDouble.twosum(this.a1, -other.a1);

		if (Number.isNaN(z1) || Number.isNaN(z2)) {
			return new DoubleDouble(NaN, NaN);
		}

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		z2 += this.a2 - other.a2;
		let [z3, z4] = DoubleDouble.twosum(z1, z2);

		if (!Number.isFinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public mul(other: DoubleDouble): DoubleDouble {
		//double z1, z2, z3, z4;

		let [z1, z2] = DoubleDouble.twoproduct(this.a1, other.a1);

		if (Number.isNaN(z1) || Number.isNaN(z2)) {
			return new DoubleDouble(NaN, NaN);
		}

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		// x.a2 * y.a2 is very small but sometimes important
		z2 += this.a1 * other.a2 + this.a2 * other.a1;
		z2 += this.a1 * other.a2 + this.a2 * other.a1 + this.a2 * other.a2;

		let [z3, z4] = DoubleDouble.twosum(z1, z2);
		if (!Number.isFinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public div(other: DoubleDouble): DoubleDouble {
		throw new Error();
	}

	public toString(): string {
		throw new Error();
	}

	public formatToString(): string {
		throw new Error();
	}
}
