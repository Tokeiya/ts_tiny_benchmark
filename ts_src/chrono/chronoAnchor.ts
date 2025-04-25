export class ChronoAnchor{
	public readonly anchor:bigint

	//anchor unit is nano seconds.
	private constructor(anchor:bigint) {
		this.anchor = anchor
	}

	public static fromHrtime(value:bigint):ChronoAnchor {
			return new ChronoAnchor(value)
	}

	public static fromPerformance(value:number):ChronoAnchor {
			return new ChronoAnchor(BigInt(Math.round(value * 1_000_000)))
	}

}