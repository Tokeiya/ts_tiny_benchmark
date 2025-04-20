export class ChronoAnchor {
	public readonly value: bigint;
	public readonly id: number | undefined;

	private constructor(value: bigint, id: number | undefined) {
		this.value = value;
		this.id = id;
	}

	public static fromProcessHrtmen(
		nanoSecondsValue: bigint,
		id: number,
	): ChronoAnchor {
		return new ChronoAnchor(nanoSecondsValue, id);
	}

	public static fromPerformanceNow(
		milliSecondsValue: number,
		id: number | undefined,
	): ChronoAnchor {
		return new ChronoAnchor(
			BigInt(Math.floor(milliSecondsValue * 1_000_000)),
			id,
		);
	}

	public checkId(other: ChronoAnchor): boolean {
		return this.id === other.id;
	}
}
