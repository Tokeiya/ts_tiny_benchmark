import { ChronoAnchor } from './chronoAnchor';
import { DoubleDouble } from '../dd/doubleDouble';

const NANO_FACTOR=DoubleDouble.fromBigint(1_000n);
const MICRO_FACTOR=DoubleDouble.fromBigint(1_000_000n);
const MILLI_FACTOR=DoubleDouble.fromBigint(1_000_000_000n);
const SECOND_FACTOR=DoubleDouble.fromBigint(1_000_000_000_000n);
const MINUTE_FACTOR=SECOND_FACTOR.mul(DoubleDouble.fromBigint(60n))
const HOUR_FACTOR=MINUTE_FACTOR.mul(DoubleDouble.fromBigint(60n));


export class TimeSpan{
	public readonly totalPicoSeconds:bigint

	constructor(elapsed:bigint){
		throw new Error('Not implemented')
	}

	public static create(start:ChronoAnchor, end:ChronoAnchor):TimeSpan{
		throw new Error('Not implemented')
	}


	public get totalNanoseconds():DoubleDouble{
		throw new Error('Not implemented')
	}

	public get totalMicroseconds():DoubleDouble{
		throw new Error('Not implemented')
	}

	public get totalMilliseconds():DoubleDouble{
		throw new Error('Not implemented')
	}

	public get totalSeconds():number{
		throw new Error('Not implemented')
	}

	public get totalMinutes():number{
		throw new Error('Not implemented')
	}

	public get totalHours():number{
		throw new Error('Not implemented')
	}

	public get totalDays():number{
		throw new Error('Not implemented')
	}

	public get picoSeconds():number{
		throw new Error('Not implemented')
	}

	public get nanoSeconds():number{
		throw new Error('Not implemented')
	}

	public get microSeconds():number{
		throw new Error('Not implemented')
	}

	public get milliSeconds():number{
		throw new Error('Not implemented')
	}

	public get seconds():number{
		throw new Error('Not implemented')
	}

	public get minutes():number{
		throw new Error('Not implemented')
	}

	public get hours():number{
		throw new Error('Not implemented')
	}

	public add(timeSpan:TimeSpan):TimeSpan{
		throw new Error('Not implemented')
	}

	public subtract(timeSpan:TimeSpan):TimeSpan{
		throw new Error('Not implemented')
	}

	public multiply(factor:number):TimeSpan{
		throw new Error('Not implemented')
	}

	public divide(divisor:number):TimeSpan{
		throw new Error('Not implemented')
	}

	public divide_ts(timeSpan:TimeSpan):number{
		throw new Error('Not implemented')
	}



}