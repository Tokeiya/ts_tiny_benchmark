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

	private static get_sign_double(x: number): number {
		if (x == 0) {
			x = 1 / x;
		}

		if (x > 0) return 1;
		else return -1;
	}

	private static ldexp(mantissa: number, exponent: number): number {
		return mantissa * Math.pow(2, exponent);
	}

	private static  ddtostring(x1:number, x2:number, precision:bigint = 34n,
	                           format:string = 'g', mode:bigint = 0n):string[] {
	int i, j;
	int sign, sign2, ex1, ex2;
	double absx1, absx2;

	if (x1 != x1 || x2 != x2) return ["nan"];

	let sign = DoubleDouble.get_sign_double(x1);
	let absx1 = Math.abs(x1);

	if (absx1 == 0.) {
	if (sign == -1) {
	return ["-0"];
} else {
	return ["0"];
}
}

if (DoubleDouble.get_sign_double(absx1)) {
	if (sign == -1) {
		return ["-inf"];
	} else {
		return ["inf"];
	}
}

// get x1 to buf

let ex1 = DoubleDouble.get_exponent(absx1);

// add 1-byte margin to add buf2
//bool buf[1023 - (-1074) + 2];


int offset = 1074;
int emax, emin;
double dtmp, dtmp2;

dtmp = absx1;
dtmp2 = std::ldexp(1., ex1);

for (i=0; i<=52; i++) {
	if (dtmp >= dtmp2) {
		buf[offset + ex1 - i] = 1;
		dtmp -= dtmp2;
	} else {
		buf[offset + ex1 - i] = 0;
	}
	if (dtmp == 0) {
		emax = ex1;
		emin = ex1 - i;
		break;
	}
	dtmp2 /= 2.;
}

// get x2 to buf2 and add it to buf

bool buf2[1023 - (-1074) + 1];
int emax2, emin2, s;
int carry, tmp;

sign2 = get_sign_double(x2);
absx2 = std::fabs(x2);

if (absx2 != 0.) {
	ex2 = get_exponent(absx2);
	dtmp = absx2;
	dtmp2 = std::ldexp(1., ex2);

	for (i=0; i<=52; i++) {
		if (dtmp >= dtmp2) {
			buf2[offset + ex2 - i] = 1;
			dtmp -= dtmp2;
		} else {
			buf2[offset + ex2 - i] = 0;
		}
		if (dtmp == 0) {
			emax2 = ex2;
			emin2 = ex2 - i;
			break;
		}
		dtmp2 /= 2.;
	}

	if (sign == sign2)  s = 1;
	else s = -1;

	if (emin > emin2) {
		for (i=emin2; i<=emin-1; i++) {
			buf[offset + i] = 0;
		}
		emin = emin2;
	}
	emax++;
	buf[offset + emax] = 0;

	carry = 0;
	for (i=emin2; i<=emax2; i++) {
		// NOTICE: tmp may become negative
		tmp = buf[offset + i] + s * buf2[offset + i] + carry;
		carry = (int)std::floor(tmp / 2.);
		buf[offset + i] = tmp - carry * 2;
	}
	for (i=emax2+1; i<=emax; i++) {
		if (carry == 0) break;
		// NOTICE: tmp may become negative
		tmp = buf[offset + i] + carry;
		carry = (int)std::floor(tmp / 2.);
		buf[offset + i] = tmp - carry * 2;
	}
	while (buf[offset + emax] == 0) {
		emax--;
	}
}


if (emin > 0) {
	for (i=0; i<emin; i++) {
		buf[offset + i] = 0;
	}
	emin = 0;
}

if (emax < 0) {
	for (i=emax + 1; i<=0; i++) {
		buf[offset + i] = 0;
	}
	emax = 0;
}

std::list<int> result1, result2;
int result_max, result_min, m, pm;

result_max = -1;

while (emax >= 0) {
	if (emax >= 17) m= 5;
	else if (emax >= 14) m = 4;
	else if (emax >= 10) m = 3;
	else if (emax >= 7) m = 2;
	else  m = 1;

	pm = 1;
	for (i=0; i<m; i++) pm *= 10;

	carry = 0;
	for (i=emax; i>=0; i--) {
		tmp = carry * 2 + buf[offset + i];
		buf[offset + i] = tmp / pm;
		carry = tmp % pm;
	}

	for (i=0; i<m; i++) {
		result_max++;
		result1.push_back(carry  % 10);
		carry /= 10;
	}

	while (emax >= 0 && buf[offset + emax] == 0) {
		emax--;
	}
}

result_min = 0;

while (emin < 0) {
	m = std::min(8, -emin);
	pm = 1;
	for (i=0; i<m; i++) pm *= 10;

	carry = 0;
	for (i=emin; i<=-1; i++) {
		tmp = buf[offset + i] * pm + carry;
		buf[offset + i] = tmp % 2;
		carry = tmp / 2;
	}

	for (i=0; i<m; i++) {
		result_min--;
		pm /= 10;
		result2.push_back(carry / pm);
		carry %= pm;
	}

	while (emin < 0 && buf[offset + emin] == 0) {
		emin++;
	}
}

std::vector<int> result;
int offset2;

// add 1byte margin to both ends of array
result.resize(result_max - result_min + 1 + 2);
offset2 = - result_min + 1;
for (i=0; i<=result_max; i++) {
	result[offset2 + i] = result1.front();
	result1.pop_front();
}
for (i=-1; i>=result_min; i--) {
	result[offset2 + i] = result2.front();
	result2.pop_front();
}

#if 0
for (i=result_min; i<=result_max; i++) {
	std::cout << i << ':' << result[offset2 + i] << "\n";
}
#endif

std::ostringstream result_str;

if (sign == 1) {
	result_str << "";
} else {
	result_str << "-";
}

if (format == 'f') {
	// round to precision after decimal point
	if (-(precision+1) >= result_min) {
		result_min = -precision;
		tmp = result[offset2 + result_min - 1];
		if ((mode == 1 && sign == 1) || (mode == -1 && sign == -1) || (mode == 0 && tmp >= 5)) {
			result[offset2 + result_max + 1] = 0;
			result_max++;
			for (i=result_min; i<=result_max; i++) {
				result[offset2 + i]++;
				if (result[offset2 + i] != 10) break;
				result[offset2 + i] = 0;
			}
			if (result[offset2 + result_max] == 0) {
				result_max--;
			}
		}
	}

	// delete zeros of tail
	while (result_min < 0 && result[offset2 + result_min] == 0) {
		result_min++;
	}

	// make result string
	for (i=result_max; i>=result_min; i--) {
		if (i == -1) result_str << ".";
		result_str << result[offset2 + i];
	}

} else if (format == 'e') {
	// delete zeros of head
	while (result[offset2 + result_max] == 0) {
		result_max--;
	}

	// round to precision
	if (result_max-precision-1 >= result_min) {
		result_min = result_max - precision;
		tmp = result[offset2 + result_min - 1];
		if ((mode == 1 && sign == 1) || (mode == -1 && sign == -1) || (mode == 0 && tmp >= 5)) {
			result[offset2 + result_max + 1] = 0;
			result_max++;
			for (i=result_min; i<=result_max; i++) {
				result[offset2 + i]++;
				if (result[offset2 + i] != 10) break;
				result[offset2 + i] = 0;
			}
			if (result[offset2 + result_max] == 0) {
				result_max--;
			} else {
				result_min++;
			}
		}
	}

	// delete zeros of tail
	while (result[offset2 + result_min] == 0) {
		result_min++;
	}

	// make result string
	for (i=result_max; i>=result_min; i--) {
		if (i == result_max -1) result_str << ".";
		result_str << result[offset2 + i];
	}
	// sprintf(stmp, "e%+03d", result_max);
	result_str << "e" << std::internal << std::showpos << std::setfill('0') << std::setw(3) << result_max << std::noshowpos;

} else if (format == 'g') {
	// delete zeros of head
	while (result[offset2 + result_max] == 0) {
		result_max--;
	}

	// round to precision
	if (result_max-precision >= result_min) {
		result_min = result_max - precision + 1;
		tmp = result[offset2 + result_min - 1];
		if ((mode == 1 && sign == 1) || (mode == -1 && sign == -1) || (mode == 0 && tmp >= 5)) {
			result[offset2 + result_max + 1] = 0;
			result_max++;
			for (i=result_min; i<=result_max; i++) {
				result[offset2 + i]++;
				if (result[offset2 + i] != 10) break;
				result[offset2 + i] = 0;
			}
			if (result[offset2 + result_max] == 0) {
				result_max--;
			} else {
				result_min++;
			}
		}
	}

	if (-4 <= result_max && result_max <= precision -1) {
		// use 'f' like format

		// delete zeros of tail
		while (result_min < 0 && result[offset2 + result_min] == 0) {
			result_min++;
		}

		if (result_max < 0) {
			result_max = 0;
		}

		// make result string
		for (i=result_max; i>=result_min; i--) {
			if (i == -1) result_str << ".";
			result_str << result[offset2 + i];
		}

	} else {
		// use 'e' like format

		// delete zeros of tail
		while (result[offset2 + result_min] == 0) {
			result_min++;
		}

		// make result string
		for (i=result_max; i>=result_min; i--) {
			if (i == result_max -1) result_str << ".";
			result_str << result[offset2 + i];
		}
		// sprintf(stmp, "e%+03d", result_max);
		result_str << "e" << std::internal << std::showpos << std::setfill('0') << std::setw(3) << result_max << std::noshowpos;
	}

} else if (format == 'a') {
	// make result string
	for (i=result_max; i>=result_min; i--) {
		if (i == -1) result_str << ".";
		result_str << result[offset2 + i];
	}
}

return result_str.str();
}


	private static get_exponent(x: number): number {
		// Perform boundary checks similar to the original C++ approach
		if (x >= Math.pow(2, 1023)) return 1023;
		if (x < Math.pow(2, -1074)) return -1075;

		// Use absolute value for exponent calculation
		const absX = Math.abs(x);

		// Compute exponent using log2, then shift to match the behavior of std::frexp
		const exponent = Math.floor(Math.log2(absX)) + 1;
		return exponent - 1;
	}

	private static fasttwosum(a: number, b: number): [number, number] {
		let x = a + b;
		let tmp = x - a;
		let y = b - tmp;
		return [x, y];
	}

	private static twosum(a: number, b: number): [number, number] {
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

	private static twoproduct(a: number, b: number): [number, number] {
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

	private static split(a: number): [number, number] {
		const sigma = (1 << 27) + 1;

		let tmp = a * sigma;
		let x = tmp - (tmp - a);
		let y = a - x;

		return [x, y];
	}

	private static isInfinite(value: number): boolean {
		return Math.abs(value) == Infinity;
	}

	public add(other: DoubleDouble): DoubleDouble {
		//double z1, z2, z3, z4;

		let [z1, z2] = DoubleDouble.twosum(this.a1, other.a1);

		if (DoubleDouble.isInfinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		z2 += this.a2 + other.a2;
		let [z3, z4] = DoubleDouble.twosum(z1, z2);

		if (DoubleDouble.isInfinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public sub(other: DoubleDouble): DoubleDouble {
		let [z1, z2] = DoubleDouble.twosum(this.a1, -other.a1);

		if (DoubleDouble.isInfinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		z2 += this.a2 - other.a2;
		let [z3, z4] = DoubleDouble.twosum(z1, z2);

		if (DoubleDouble.isInfinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public mul(other: DoubleDouble): DoubleDouble {
		//double z1, z2, z3, z4;

		let [z1, z2] = DoubleDouble.twoproduct(this.a1, other.a1);

		if (DoubleDouble.isInfinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		// x.a2 * y.a2 is very small but sometimes important
		z2 += this.a1 * other.a2 + this.a2 * other.a1;
		z2 += this.a1 * other.a2 + this.a2 * other.a1 + this.a2 * other.a2;

		let [z3, z4] = DoubleDouble.twosum(z1, z2);
		if (DoubleDouble.isInfinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public div(other: DoubleDouble): DoubleDouble {
		let z2 = 0.0;

		let z1 = this.a1 / other.a1;
		if (DoubleDouble.isInfinite(z1)) {
			return new DoubleDouble(z1, 0);
		}

		if (DoubleDouble.isInfinite(other.a1)) {
			return new DoubleDouble(z1, 0);
		}

		let [z3, z4] = DoubleDouble.twoproduct(-z1, other.a1);
		if (DoubleDouble.isInfinite(z3)) {
			[z3, z4] = DoubleDouble.twoproduct(-z1, other.a1 * 0.5);
			z2 =
				(z3 + this.a1 * 0.5 - z1 * (other.a2 * 0.5) + this.a2 * 0.5 + z4) /
				(other.a1 * 0.5);
		} else {
			// z2 = ((((z3 + x.a1) - z1 * y.a2) + x.a2) + z4) / (y.a1 + y.a2);
			z2 = (z3 + this.a1 - z1 * other.a2 + this.a2 + z4) / other.a1;
		}

		[z3, z4] = DoubleDouble.twosum(z1, z2);
		if (DoubleDouble.isInfinite(z3)) {
			return new DoubleDouble(z3, 0);
		}

		return new DoubleDouble(z3, z4);
	}

	public toString(): string {
		throw new Error();
	}

	public formatToString(): string {
		throw new Error();
	}
}
