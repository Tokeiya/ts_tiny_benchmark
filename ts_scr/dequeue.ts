import { IndexController } from './indexController.js';
import { InconsistencyError } from './error/inconsistencyError.js';
import { InvalidOperationError } from './error/invalidOperationError.js';

export class Empty {
	private static _singleton: Empty = new Empty();

	private constructor() {}

	public static get Singleton() {
		return Empty._singleton;
	}
}

export class Dequeue<T> implements Iterable<T> {
	private _storage: Array<T | Empty | undefined> = [];
	private _controller: IndexController = new IndexController(0);
	private _version: number = 0;

	constructor() {}

	public get length(): number {
		return this._controller.length;
	}

	*[Symbol.iterator](): Iterator<T> {
		let version = this._version;
		let len = this.length;

		for (let i = 0; i < len; i++) {
			if (this._version !== version) {
				throw new InvalidOperationError('Collection changed');
			}
			yield this.get_value(i)!;
		}
	}

	public push(value: T) {
		this.push_internal(value);
	}

	public unshift(value: T) {
		if (this._controller.length == this._controller.capacity) {
			this.expand();
		}

		if (!this._controller.try_move_forward_tail()) {
			throw new InconsistencyError('Tail is not moved');
		}

		this._version++;
		this._storage[this._controller.tail] = value;
	}

	public pop(): T | undefined {
		if (this._controller.length == 0) {
			return undefined;
		}

		let val = this._storage[this._controller.head];

		if (val instanceof Empty) {
			throw new InconsistencyError('Empty value');
		}

		if (!this._controller.try_move_backward_head()) {
			throw new InconsistencyError('Head is not moved');
		}

		this._version++;

		return val;
	}

	//equivalent to dequeue.
	public shift(): T | undefined {
		if (this._controller.length == 0) {
			return undefined;
		}

		let val = this._storage[this._controller.tail];

		if (val instanceof Empty) {
			throw new InconsistencyError('Empty value');
		}

		if (!this._controller.try_move_backward_tail()) {
			throw new InconsistencyError('Tail is not moved');
		}

		this._version++;

		return val;
	}

	public get_value(index: number): T | undefined {
		if (index < 0 || index >= this._controller.length) {
			return undefined;
		}

		let val = this._storage[this._controller.convert_index(index)];

		if (val instanceof Empty) {
			return undefined;
		}

		return val;
	}

	//if index>=length then push undefined and expand the size.
	public set_value(index: number, value: T) {
		if (index >= this.length) {
			let limit = index - this.length;
			for (let i = 0; i < limit; i++) {
				this.push_internal(undefined);
			}
			this.push_internal(value);
		} else {
			this._storage[index] = value;
		}
	}

	private push_internal(value: T | undefined) {
		if (this._controller.length == this._controller.capacity) {
			this.expand();
		}

		if (!this._controller.try_move_forward_head()) {
			throw new InconsistencyError('Head is not moved');
		}

		this._version++;
		this._storage[this._controller.head] = value;
	}

	private expand() {
		let ctrl = this._controller.inflate();
		let ary: Array<T | undefined | Empty> = [];

		for (let val of this) {
			ary.push(val);
			if (!ctrl.try_move_forward_head()) {
				throw new InconsistencyError('Head is not moved');
			}
		}

		this._controller = ctrl;
		this._storage = ary;
		this._version++;
	}
}
