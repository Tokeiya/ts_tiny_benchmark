export class CollectionChangedError extends Error {
	constructor() {
		super('Collection was modified; enumeration operation may not execute.');
	}
}
