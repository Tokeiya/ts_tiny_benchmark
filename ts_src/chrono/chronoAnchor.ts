export class ChronoAnchor {
	public readonly value: bigint;
	public readonly id: number | undefined;

	private constructor(value: bigint, id: number | undefined) {
		throw new Error();
	}

	public static fromProcessHrtmen(value: bigint, id: number): ChronoAnchor {
		throw new Error('Not implemented');
	}

	public static fromPerformanceNow(value: number, id: number | undefined) {
		throw new Error('Not implemented');
	}
}
