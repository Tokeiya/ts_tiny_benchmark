import { ChronoAnchor } from './chronoAnchor';
import { DoubleDouble } from '../dd/doubleDouble';

export class TimeSpan{
	public readonly elapsed:bigint

	constructor(elapsed:bigint){
		throw new Error('Not implemented')
	}

	public static create(start:ChronoAnchor, end:ChronoAnchor):TimeSpan{
		throw new Error('Not implemented')
	}

	public totalPicoseconds():bigint{
		throw new Error('Not implemented')
	}

	public totalNanoseconds():DoubleDouble{
		throw new Error('Not implemented')
	}

	public totalMicroseconds():DoubleDouble{
		throw new Error('Not implemented')
	}

	public totalMilliseconds():DoubleDouble{
		throw new Error('Not implemented')
	}

	public totalSeconds():number{
		throw new Error('Not implemented')
	}

	public totalMinutes():number{
		throw new Error('Not implemented')
	}

	public totalHours():number{
		throw new Error('Not implemented')
	}

	public totalDays():number{
		throw new Error('Not implemented')
	}

	public picoSeconds():number{
		throw new Error('Not implemented')
	}

	public nanoSeconds():number{
		throw new Error('Not implemented')
	}

	public microSeconds():number{
		throw new Error('Not implemented')
	}

	public milliSeconds():number{
		throw new Error('Not implemented')
	}

	public seconds():number{
		throw new Error('Not implemented')
	}

	public minutes():number{
		throw new Error('Not implemented')
	}

	public hours():number{
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



}