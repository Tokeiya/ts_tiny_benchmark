export class IdentityMismatch extends Error {
	public readonly identity: string | undefined
	public readonly otherIdentity: string | undefined

	constructor(identity: string | undefined, otherIdentity: string | undefined) {
		super(`Identity mismatch: ${identity} !== ${otherIdentity}`)
		this.identity = identity
		this.otherIdentity = otherIdentity
		this.name = 'IdentityMismatch'
	}
}