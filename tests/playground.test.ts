import { expect, test } from 'vitest';
import { add } from '../scr/playground.js';
import { DoubleDouble } from '../scr/double-double.js';

test('from_bigint', () => {
	let EXPECTED = 1359412196944337449n;
	let fixture = DoubleDouble.fromBigint(EXPECTED);
	expect(BigInt(fixture.hi) + BigInt(fixture.lo)).toBe(EXPECTED);

	EXPECTED = -1359412196944337449n;
	fixture = DoubleDouble.fromBigint(EXPECTED);
	expect(BigInt(fixture.hi) + BigInt(fixture.lo)).toBe(EXPECTED);
});

test('from_number', () => {
	const EXPECTED = 333289666298730;
	const fixture = DoubleDouble.fromNumber(EXPECTED);
	expect(fixture.hi).toBe(EXPECTED);
	expect(fixture.lo).toBe(0);
});

test('to_bigint', () => {
	const EXPECTED = 1359412196944337449n;
	const fixture = DoubleDouble.fromBigint(EXPECTED);
	expect(fixture.to_bigint()).toBe(EXPECTED);
});

test('to_number', () => {
	const EXPECTED = 333289666298730;
	const fixture = DoubleDouble.fromBigint(BigInt(EXPECTED));
	expect(fixture.to_number()).toBe(EXPECTED);
});

test('add', () => {
	//617_866_411_302_104_816 + 182_880_836_721_589_420 = 800_747_248_023_694_236
	let left = DoubleDouble.fromBigint(617_866_411_302_104_816n);
	let right = DoubleDouble.fromBigint(182_880_836_721_589_420n);
	expect(left.add(right).to_bigint()).toBe(800_747_248_023_694_236n);

	left = DoubleDouble.fromBigint(-182_880_836_721_589_420n);
	right = DoubleDouble.fromBigint(-617_866_411_302_104_816n);
	expect(left.add(right).to_bigint()).toBe(-800_747_248_023_694_236n);
});

test('sub', () => {
	//367_037_601_893_495_125 - 290_414_123_899_311_523 = 76_623_477_994_183_602
	let left = DoubleDouble.fromBigint(367_037_601_893_495_125n);
	let right = DoubleDouble.fromBigint(290_414_123_899_311_523n);
	expect(left.subtract(right).to_bigint()).toBe(76_623_477_994_183_602n);

	//542_352_827_377_413_329 - 881_841_288_001_315_584 = -339_488_460_623_902_255
	left = DoubleDouble.fromBigint(542_352_827_377_413_329n);
	right = DoubleDouble.fromBigint(881_841_288_001_315_584n);
	expect(left.subtract(right).to_bigint()).toBe(-339_488_460_623_902_255n);
});

test('mul', () => {
	//2_191_834_384 * 2_067_185_096 = 4_530_927_371_505_140_864
	let left = DoubleDouble.fromNumber(2_191_834_384);
	let right = DoubleDouble.fromNumber(2_067_185_096);

	expect(left.multiply(right).to_bigint()).toBe(4_530_927_371_505_140_864n);

	//-2_191_834_384 * 2_067_185_096 = 4_530_927_371_505_140_864
	left = DoubleDouble.fromNumber(-2_191_834_384);
	right = DoubleDouble.fromNumber(2_067_185_096);
	expect(left.multiply(right).to_bigint()).toBe(-4_530_927_371_505_140_864n);

	//2_191_834_384 * -2_067_185_096 = 4_530_927_371_505_140_864
	left = DoubleDouble.fromNumber(2_191_834_384);
	right = DoubleDouble.fromNumber(-2_067_185_096);
	expect(left.multiply(right).to_bigint()).toBe(-4_530_927_371_505_140_864n);

	//-2_191_834_384 * -2_067_185_096 = 4_530_927_371_505_140_864
	left = DoubleDouble.fromNumber(-2_191_834_384);
	right = DoubleDouble.fromNumber(-2_067_185_096);
	expect(left.multiply(right).to_bigint()).toBe(4_530_927_371_505_140_864n);
});

test('div', () => {
	//355_261_669_041_684_624 / 22_203_854_315_105_289 = 16
	let left = DoubleDouble.fromBigint(355_261_669_041_684_624n);
	let right = DoubleDouble.fromBigint(22_203_854_315_105_289n);
	expect(left.divide(right).to_bigint()).toBe(16n);

	//-355_261_669_041_684_624 / 22_203_854_315_105_289 = -16
	left = DoubleDouble.fromBigint(-355_261_669_041_684_624n);
	right = DoubleDouble.fromBigint(22_203_854_315_105_289n);
	expect(left.divide(right).to_bigint()).toBe(-16n);

	//355_261_669_041_684_624 / -22_203_854_315_105_289 = -16
	left = DoubleDouble.fromBigint(355_261_669_041_684_624n);
	right = DoubleDouble.fromBigint(-22_203_854_315_105_289n);
	expect(left.divide(right).to_bigint()).toBe(-16n);
});
