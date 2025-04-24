import {test, expect} from 'vitest';
import {ChronoAnchor} from '../ts_src/chrono/chronoAnchor.js';
import {TimeSpan} from '../ts_src/chrono/timeSpan.js';

test('TimeSpan constructor', () => {
	const timeSpan = new TimeSpan(123456789n);
	expect(timeSpan.elapsed).toBe(123456789n);
});

test('TimeSpan create', () => {
	const start = ChronoAnchor.fromHrtime(123456789n, 1);
	const end = ChronoAnchor.fromHrtime(987654321n, 1);
	const timeSpan = TimeSpan.create(start, end);
	expect(timeSpan.elapsed).toBe(864197532n);
});

test('TimeSpan create invalid identity', () => {
	const start = ChronoAnchor.fromHrtime(123456789n, 1);
	const end = ChronoAnchor.fromHrtime(987654321n, undefined);
	expect(() => TimeSpan.create(start, end)).toThrowError('Invalid identity');
})

test('TimeSpan totalPicoseconds', () => {
	const timeSpan = new TimeSpan(123456789n);
	expect(timeSpan.totalPicoseconds()).toBe(123456789n);
});

test('TimeSpan totalNanoseconds', () => {
	const timeSpan = new TimeSpan(1234567890n);
	const result = timeSpan.totalNanoseconds();
	console.log(result);
	throw new Error('Not implemented')
});

test('TimeSpan totalMicroseconds', () => {
	const timeSpan = new TimeSpan(1234_567_890n);
	const result = timeSpan.totalMicroseconds();
	console.log(result);
	throw new Error('Not implemented')
});

test('TimeSpan totalMilliseconds', () => {
	const timeSpan = new TimeSpan(123_456_789_012n);
	const result = timeSpan.totalMilliseconds();
	console.log(result);
	throw new Error('Not implemented')
});

test('TimeSpan totalSeconds', () => {
	const timeSpan = new TimeSpan(123_456_789_012_345n);
	const result = timeSpan.totalSeconds();
	console.log(result);
	throw new Error('Not implemented')
});

test('TimeSpan totalMinutes', () => {
	const timeSpan = new TimeSpan(123_456_789_012_345_678n);
	const result = timeSpan.totalMinutes();
	console.log(result);
	throw new Error('Not implemented')
});

test('TimeSpan totalHours', () => {
	const timeSpan = new TimeSpan(123_456_789_012_345_678_901n);
	const result = timeSpan.totalHours();
	console.log(result);
	throw new Error('Not implemented')
});

test('TimeSpan totalDays', () => {
	const timeSpan = new TimeSpan(123_456_789_012_345_678_901_234n);
	const result = timeSpan.totalDays();
	console.log(result);
	throw new Error('Not implemented')
});

test('picoseconds', () => {
	const timeSpan = new TimeSpan(123456789n);
	expect(timeSpan.picoSeconds()).toBe(0n);
});