export class ChronoAnchor{
	public readonly anchor:bigint
	public readonly identity:string|undefined

	private constructor(anchor:bigint, identity:string|undefined) {
		this.anchor = anchor
		this.identity = identity
	}

	public static fromHrtime(value:bigint, identity:number|undefined):ChronoAnchor {
		if (identity === undefined) {
			return new ChronoAnchor(value, undefined)
		}else{
			return new ChronoAnchor(value, identity.toString())
		}
	}

	public static fromPerformance(value:number, identity:number|undefined):ChronoAnchor {
		if(identity === undefined) {
			return new ChronoAnchor(BigInt(Math.round(value * 1_000_000)), undefined)
		}else{
			return new ChronoAnchor(BigInt(Math.round(value * 1_000_000)), identity.toString())
		}
	}

	public checkIdentity(other:ChronoAnchor):boolean {
		return this.identity===other.identity
	}
}