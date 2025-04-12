import { ArgumentError } from './error/argumentError.js';
import { InconsistencyError } from './error/inconsistencyError.js';
import { InvalidOperationError } from './error/invalidOperationError.js';

export class IndexController {
	public readonly mask: number;
	public readonly capacity: number;

	constructor(capacity: number) {
		if (capacity < 0 || Math.log2(capacity) > 30) {
			throw new ArgumentError('Invalid capacity');
		} else if (capacity === 0) {
			this.mask = 0;
			this.capacity = 0;
		} else {
			let tmp = Math.log2(capacity);

			if (tmp === 0) {
				tmp = 1;
			}

			this.capacity = Math.pow(2, Math.ceil(tmp));
			this.mask = this.capacity - 1;
		}
	}

	private _head: number | undefined = undefined;

	public get head(): number {
		if (this._head === undefined) {
			throw new InvalidOperationError('Empty');
		}

		return this._head;
	}

	private _tail: number | undefined = undefined;

	public get tail(): number {
		if (this._tail === undefined) {
			throw new InvalidOperationError('Empty');
		}

		return this._tail;
	}

	private _length: number = 0;

	public get length(): number {
		return this._length;
	}

	public inflate(): IndexController {
		if (Math.log2(this.capacity) >= 30) {
			throw new InvalidOperationError('Capacity too large');
		}

		return new IndexController(this.capacity + 1);
	}

	public deflate(): IndexController {
		if (this.capacity === 0) {
			throw new InvalidOperationError('Capacity too small');
		} else if (this.capacity === 2) {
			return new IndexController(0);
		} else {
			return new IndexController(this.capacity / 2);
		}
	}

	public convert_index(index: number): number {
		if (!Number.isInteger(index) || index < 0 || index >= this._length) {
			throw new ArgumentError('Index out of bounds');
		}

		return (index + this.tail) & this.mask;
	}

	public try_move_forward_head(): boolean {
		if (this._head === undefined) {
			if (this._tail !== undefined) {
				throw new InconsistencyError('Head is undefined but tail is not');
			}
			this._head = this._tail = 0;
			this._length += 1;
			return true;
		}

		let candidate = (this._head + 1) & this.mask;
		if (this._tail === candidate) {
			return false;
		}

		this._head = candidate;
		this._length += 1;
		return true;
	}

	public try_move_forward_tail(): boolean {
		if (this._tail === undefined) {
			if (this._head !== undefined) {
				throw new InconsistencyError('Tail is undefined but head is not');
			}

			this._head = this._tail = 0;
			this._length += 1;
			return true;
		}

		let candidate = (this._tail - 1) & this.mask;
		if (this._head === candidate) {
			return false;
		}

		this._tail = candidate;
		this._length += 1;
		return true;
	}

	public try_move_backward_head(): boolean {
		if (this._tail === undefined && this._head === undefined) {
			return false;
		}

		if (this._head === undefined || this._tail === undefined) {
			throw new InconsistencyError('Unexpected state');
		}

		if (this._head === this._tail) {
			this._head = this._tail = undefined;
		} else {
			let tmp = this.head - 1;
			tmp &= this.mask;
			this._head = tmp;
		}
		this._length--;
		return true;
	}

	public try_move_backward_tail(): boolean {
		if (this._tail === undefined && this._head === undefined) {
			return false;
		}

		if (this._tail === undefined || this._head === undefined) {
			throw new InconsistencyError('Unexpected state');
		}

		if (this._head === this._tail) {
			this._head = this._tail = undefined;
		} else {
			let tmp = this._tail + 1;
			tmp &= this.mask;
			this._tail = tmp;
		}

		this._length--;
		return true;
	}

	public force_move_forward_head(): void {
		if (!this.try_move_forward_head()) {
			if (this._tail === undefined || this._head === undefined) {
				throw new InconsistencyError('Unexpected state');
			}

			let tmp = this._tail + 1;
			tmp &= this.mask;
			this._tail = tmp;

			tmp = this._head + 1;
			tmp &= this.mask;
			this._head = tmp;
		}
	}
}
