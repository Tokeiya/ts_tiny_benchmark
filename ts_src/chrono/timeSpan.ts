import { ChronoAnchor } from './chronoAnchor';
import { DoubleDouble } from '../dd/doubleDouble';

const NANO_FACTOR=DoubleDouble.fromBigint(1_000n);
const MICRO_FACTOR=DoubleDouble.fromBigint(1_000_000n);
const MILLI_FACTOR=DoubleDouble.fromBigint(1_000_000_000n);
const SECOND_FACTOR=DoubleDouble.fromBigint(1_000_000_000_000n);
const MINUTE_FACTOR=SECOND_FACTOR.mul(DoubleDouble.fromBigint(60n))
const HOUR_FACTOR=MINUTE_FACTOR.mul(DoubleDouble.fromBigint(60n));
const DAY_FACTOR=HOUR_FACTOR.mul(DoubleDouble.fromBigint(24n));


export class TimeSpan{
	public readonly totalPicoSeconds:bigint

	constructor(elapsed:bigint){
		this.totalPicoSeconds=elapsed;
	}

	public static create(start:ChronoAnchor, end:ChronoAnchor):TimeSpan{
		const elapsed=end.anchor-start.anchor;
		return new TimeSpan(elapsed*1_000n);
	}


	public get totalNanoseconds():DoubleDouble{
		const tmp=DoubleDouble.fromBigint(this.totalPicoSeconds);
		return tmp.div(NANO_FACTOR);
	}

	public get totalMicroseconds():DoubleDouble{
		const tmp=DoubleDouble.fromBigint(this.totalPicoSeconds);
		return tmp.div(MICRO_FACTOR);
	}

	public get totalMilliseconds():DoubleDouble{
		const tmp=DoubleDouble.fromBigint(this.totalPicoSeconds);
		return tmp.div(MILLI_FACTOR);
	}

	public get totalSeconds():DoubleDouble{
		const tmp=DoubleDouble.fromBigint(this.totalPicoSeconds);
		return tmp.div(SECOND_FACTOR)
	}

	public get totalMinutes():DoubleDouble{
		const tmp=DoubleDouble.fromBigint(this.totalPicoSeconds);
		return tmp.div(MINUTE_FACTOR)
	}

	public get totalHours():DoubleDouble{
		const tmp=DoubleDouble.fromBigint(this.totalPicoSeconds);
		return tmp.div(HOUR_FACTOR)
	}

	public get totalDays():DoubleDouble{
		const tmp=DoubleDouble.fromBigint(this.totalPicoSeconds);
		return tmp.div(DAY_FACTOR)
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