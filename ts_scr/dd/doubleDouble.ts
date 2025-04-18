export class DoubleDouble {
	public readonly hi: number;
	public readonly lo: number;

	public static from_numbers(value: number): DoubleDouble {
		throw new Error();
	}

	public static from_bigint(value: bigint): DoubleDouble {
		throw new Error();
	}

	public constructor(hi: number, lo: number) {
		this.hi = hi;
		this.lo = lo;
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

	static split(a: number): [number, number] {
		const SIGMA;
	}

	public add(other: DoubleDouble): DoubleDouble {
		throw new Error();
	}

	public sub(other: DoubleDouble): DoubleDouble {
		throw new Error();
	}

	public mul(other: DoubleDouble): DoubleDouble {
		throw new Error();
	}

	public div(other: DoubleDouble): DoubleDouble {
		throw new Error();
	}

	public toString(): string {
		throw new Error();
	}
}
