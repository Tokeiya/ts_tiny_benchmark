export class IdMismatch extends Error {
	public readonly thisId: number | undefined;
	public readonly otherId: number | undefined;

	public constructor(thisId: number | undefined, otherId: number | undefined) {
		super(`Id mismatch: ${thisId} != ${otherId}`);

		this.thisId = thisId;
		this.otherId = otherId;
	}
}
