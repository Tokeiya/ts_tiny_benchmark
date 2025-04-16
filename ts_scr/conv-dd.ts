import { Dequeue } from './dequeue.js';

export function get_sign_double(x: number): number {
	if (x === 0) {
		x = 1 / x;
	}

	if (x > 0) return 1;
	else return -1;
}

export function get_exponent(x: number): number {
	// Perform boundary checks similar to the original C++ approach
	if (x >= Math.pow(2, 1023)) return 1023;
	if (x < Math.pow(2, -1074)) return -1075;

	// Use absolute value for exponent calculation
	const absX = Math.abs(x);

	// Compute exponent using log2, then shift to match the behavior of std::frexp
	const exponent = Math.floor(Math.log2(absX)) + 1;
	return exponent - 1;
}

function ldexp(mantissa: number, exponent: number): number {
	return mantissa * Math.pow(2, exponent);
}

export function ddtostring(
	x1: number,
	x2: number,
	precision: number = 34,
	format: string = 'g',
): string[] {
	let i: number;
	let sign: number, sign2: number, ex1: number, ex2: number;
	let absx1: number, absx2: number;

	if (x1 != x1 || x2 != x2) return ['nan'];

	sign = get_sign_double(x1);
	absx1 = Math.abs(x1);

	if (absx1 == 0) {
		if (sign == -1) {
			return ['-0'];
		} else {
			return ['0'];
		}
	}

	if (!Number.isFinite(absx1)) {
		if (sign == -1) {
			return ['-inf'];
		} else {
			return ['inf'];
		}
	}

	// get x1 to buf

	ex1 = get_exponent(absx1);

	let buf = Array(1023 - -1074 + 2).fill(0);
	let offset = 1074;
	let emax: number = 0,
		emin: number = 0;
	let dtmp: number, dtmp2: number;

	dtmp = absx1;
	dtmp2 = ldexp(1, ex1);

	for (i = 0; i <= 52; i++) {
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
		dtmp2 /= 2;
	}

	// get x2 to buf2 and add it to buf

	let buf2 = Array(1023 - -1074 + 1).fill(0);
	let emax2: number = 0,
		emin2: number = 0,
		s: number;
	let carry: number, tmp: number;

	sign2 = get_sign_double(x2);
	absx2 = Math.abs(x2);

	if (absx2 != 0) {
		ex2 = get_exponent(absx2);
		dtmp = absx2;
		dtmp2 = ldexp(1, ex2);

		for (i = 0; i <= 52; i++) {
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
			//dtmp2 /= 2;
			dtmp2 = Math.floor(dtmp2 / 2);
		}

		if (sign == sign2) s = 1;
		else s = -1;

		if (emin > emin2) {
			for (i = emin2; i <= emin - 1; i++) {
				buf[offset + i] = 0;
			}
			emin = emin2;
		}
		emax++;
		buf[offset + emax] = 0;

		carry = 0;
		for (i = emin2; i <= emax2; i++) {
			// NOTICE: tmp may become negative
			tmp = buf[offset + i] + s * buf2[offset + i] + carry;
			carry = Math.floor(tmp / 2);
			buf[offset + i] = tmp - carry * 2;
		}
		for (i = emax2 + 1; i <= emax; i++) {
			if (carry == 0) break;
			// NOTICE: tmp may become negative
			tmp = buf[offset + i] + carry;
			carry = Math.floor(tmp / 2);
			buf[offset + i] = tmp - carry * 2;
		}
		while (buf[offset + emax] == 0) {
			emax--;
		}
	}

	if (emin > 0) {
		for (i = 0; i < emin; i++) {
			buf[offset + i] = 0;
		}
		emin = 0;
	}

	if (emax < 0) {
		for (i = emax + 1; i <= 0; i++) {
			buf[offset + i] = 0;
		}
		emax = 0;
	}

	let result1: Dequeue<number> = new Dequeue();
	let result2: Dequeue<number> = new Dequeue();

	let result_max: number, result_min: number, m: number, pm: number;

	result_max = -1;

	while (emax >= 0) {
		if (emax >= 17) m = 5;
		else if (emax >= 14) m = 4;
		else if (emax >= 10) m = 3;
		else if (emax >= 7) m = 2;
		else m = 1;

		pm = 1;
		for (i = 0; i < m; i++) pm *= 10;

		carry = 0;
		for (i = emax; i >= 0; i--) {
			tmp = carry * 2 + buf[offset + i];
			buf[offset + i] = Math.floor(tmp / pm);

			carry = tmp % pm;
		}

		for (i = 0; i < m; i++) {
			result_max++;
			result1.push(carry % 10);
			carry = Math.floor(carry / 10);
		}

		while (emax >= 0 && buf[offset + emax] == 0) {
			emax--;
		}
	}

	result_min = 0;

	while (emin < 0) {
		m = Math.min(8, -emin);
		pm = 1;
		for (i = 0; i < m; i++) pm *= 10;

		carry = 0;
		for (i = emin; i <= -1; i++) {
			tmp = buf[offset + i] * pm + carry;
			buf[offset + i] = tmp % 2;
			carry = Math.floor(tmp / 2);
		}

		for (i = 0; i < m; i++) {
			result_min--;
			//pm /= 10;
			pm = Math.floor(pm / 10);
			result2.push(Math.floor(carry / pm));
			carry %= pm;
		}

		while (emin < 0 && buf[offset + emin] == 0) {
			emin++;
		}
	}

	//std::vector<int> result;
	let result = Array(result_max - result_min + 1 + 2).fill(0);
	let offset2: number;

	// add 1byte margin to both ends of array
	//result.resize(result_max - result_min + 1 + 2);
	offset2 = -result_min + 1;
	for (i = 0; i <= result_max; i++) {
		result[offset2 + i] = result1.get_value(0);
		result1.shift();
	}
	for (i = -1; i >= result_min; i--) {
		result[offset2 + i] = result2.get_value(0);
		result2.shift();
	}

	//std::ostringstream result_str;
	let result_str: string[] = [];

	if (sign == 1) {
		//result_str << "";
		result_str.push('');
	} else {
		//result_str << "-";
		result_str.push('-');
	}

	if (format == 'f') {
		// round to precision after decimal point
		if (-(precision + 1) >= result_min) {
			result_min = -precision;
			tmp = result[offset2 + result_min - 1];
			if (tmp >= 5) {
				result[offset2 + result_max + 1] = 0;
				result_max++;
				for (i = result_min; i <= result_max; i++) {
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
		for (i = result_max; i >= result_min; i--) {
			//if (i == -1) result_str << ".";
			if (i == -1) result_str.push('.');
			//result_str << result[offset2 + i];
			result_str.push(result[offset2 + i]);
		}
	} else if (format == 'e') {
		// delete zeros of head
		while (result[offset2 + result_max] == 0) {
			result_max--;
		}

		// round to precision
		if (result_max - precision - 1 >= result_min) {
			result_min = result_max - precision;
			tmp = result[offset2 + result_min - 1];
			if (tmp >= 5) {
				result[offset2 + result_max + 1] = 0;
				result_max++;
				for (i = result_min; i <= result_max; i++) {
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
		for (i = result_max; i >= result_min; i--) {
			//if (i == result_max - 1) result_str << ".";
			if (i == result_max - 1) result_str.push('.');
			//result_str << result[offset2 + i];
			result_str.push(result[offset2 + i]);
		}
		// sprintf(stmp, "e%+03d", result_max);
		// result_str << "e" << std::internal << std::showpos << std::setfill('0') << std::setw(3) << result_max <<
		// std::noshowpos;
		result_str.push('e');
		result_str.push(result_max.toString());
	} else if (format == 'g') {
		// delete zeros of head
		while (result[offset2 + result_max] == 0) {
			result_max--;
		}

		// round to precision
		if (result_max - precision >= result_min) {
			result_min = result_max - precision + 1;
			tmp = result[offset2 + result_min - 1];
			if (tmp >= 5) {
				result[offset2 + result_max + 1] = 0;
				result_max++;
				for (i = result_min; i <= result_max; i++) {
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

		if (-4 <= result_max && result_max <= precision - 1) {
			// use 'f' like format

			// delete zeros of tail
			while (result_min < 0 && result[offset2 + result_min] == 0) {
				result_min++;
			}

			if (result_max < 0) {
				result_max = 0;
			}

			// make result string
			for (i = result_max; i >= result_min; i--) {
				//if (i == -1) result_str << ".";
				if (i == -1) result_str.push('.');
				//result_str << result[offset2 + i];
				result_str.push(result[offset2 + i]);
			}
		} else {
			// use 'e' like format

			// delete zeros of tail
			while (result[offset2 + result_min] == 0) {
				result_min++;
			}

			// make result string
			for (i = result_max; i >= result_min; i--) {
				if (i == result_max - 1) result_str.push('.');
				result_str.push(result[offset2 + i]);
			}
			// sprintf(stmp, "e%+03d", result_max);
			// result_str << "e" << std::internal << std::showpos << std::setfill('0') << std::setw(3) <<
			//result_max << std::noshowpos;
			result_str.push('ALTERNATE');
		}
	} else if (format == 'a') {
		// make result string
		for (i = result_max; i >= result_min; i--) {
			//if (i == -1) result_str << ".";
			if (i == -1) result_str.push('.');
			//result_str << result[offset2 + i];
			result_str.push(result[offset2 + i]);
		}
	}

	return result_str;
}
