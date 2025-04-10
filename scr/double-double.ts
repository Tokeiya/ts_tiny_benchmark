export class DoubleDouble {
	public readonly hi: number;
	public readonly lo: number;

	public constructor(hi: number, lo: number) {
		this.hi = hi;
		this.lo = lo;
	}

	public static fromNumber(num: number): DoubleDouble {
		return new DoubleDouble(num, 0);
	}

	public static fromBigint(num: bigint): DoubleDouble {
		const hi = Number(num);
		const lo = Number(num - BigInt(hi));
		return new DoubleDouble(hi, lo);
	}

	static twoSum(a: number, b: number): [number, number] {
		const x = a + b;
		let tmp: number = 0;
		let y: number = 0;

		if (Math.abs(a) > Math.abs(b)) {
			tmp = x - a;
			y = b - tmp;
		} else {
			tmp = x - b;
			y = a - tmp;
		}

		return [x, y];
	}

	public add(other: DoubleDouble): DoubleDouble {
		let [z1, z2] = DoubleDouble.twoSum(this.hi, other.hi);

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(Infinity, 0);
		}

		z2 = z2 + this.lo + other.lo;
		[z1, z2] = DoubleDouble.twoSum(z1, z2);

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(Infinity, 0);
		}

		return new DoubleDouble(z1, z2);
	}

	public subtract(other: DoubleDouble): DoubleDouble {
		let [z1, z2] = DoubleDouble.twoSum(this.hi, -other.hi);

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(Infinity, 0);
		}

		z2 = z2 + this.lo - other.lo;
		[z1, z2] = DoubleDouble.twoSum(z1, z2);

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(Infinity, 0);
		}

		return new DoubleDouble(z1, z2);
	}

	static split(value: number): [number, number] {
		let tmp = value * (2 ** 27 + 1);
		let x = tmp - (tmp - value);
		let y = value - x;
		return [x, y];
	}

	static twoProduct(a: number, b: number): [number, number] {
		let x = a * b;
		let y = 0;
		let an = 0;
		let bn = 0;

		if (Math.abs(a) > 2 ** 996) {
			an = a * 2 ** -28;
			bn = b * 2 ** 28;
		} else if (Math.abs(b) > 2 ** 996) {
			an = a * 2 ** 28;
			bn = b * 2 ** -28;
		} else {
			an = a;
			bn = b;
		}

		const [a1, a2] = DoubleDouble.split(an);
		const [b1, b2] = DoubleDouble.split(bn);

		if (Math.abs(x) > 2 ** 1023) {
			y = (a1 * 0.5 * b1 - x * 0.5) * 2 + a2 * b1 + a1 * b2 + a2 * b2;
		} else {
			y = a1 * b1 - x + a2 * b1 + a1 * b2 + a2 * b2;
		}

		return [x, y];
	}

	public multiply(other: DoubleDouble): DoubleDouble {
		let [z1, z2] = DoubleDouble.twoProduct(this.hi, other.hi);

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(Infinity, 0);
		}

		z2 = z2 + this.hi * other.lo + this.lo * this.hi + this.lo * other.lo;

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(Infinity, 0);
		}

		return new DoubleDouble(z1, z2);
	}

	public divide(other: DoubleDouble): DoubleDouble {
		let z1 = this.hi / other.hi;
		let z2 = 0;

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(Infinity, 0);
		}

		if (!Number.isFinite(this.hi)) {
			return new DoubleDouble(Infinity, 0);
		}

		let [z3, z4] = DoubleDouble.twoProduct(-z1, other.hi);

		if (!Number.isFinite(z3)) {
			[z3, z4] = DoubleDouble.twoProduct(-z1, other.hi * 0.5);
			z2 =
				(z3 + this.hi * 0.5 - z1 * (other.lo * 0.5) + this.lo * 0.5 + z4) /
				(other.hi * 0.5);
		} else {
			z2 = (z3 + this.hi - z1 * other.lo + this.lo + z4) / other.hi;
			[z1, z2] = DoubleDouble.twoSum(z1, z2);
		}

		if (!Number.isFinite(z1)) {
			return new DoubleDouble(Infinity, 0);
		}

		return new DoubleDouble(z1, z2);
	}

	public to_number(): number {
		return this.hi + this.lo;
	}

	public to_bigint(): bigint {
		return BigInt(this.hi) + BigInt(this.lo);
	}

	public toString(): string {
		return `${this.hi} + ${this.lo}`;
	}
}
