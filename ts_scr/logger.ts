import { open, FileHandle } from 'fs/promises';

export class Logger {
	private handle: FileHandle;

	public static async create(path: string): Promise<Logger> {
		const file = await open(path, 'w');
		return new Logger(file);
	}

	constructor(handle: FileHandle) {
		this.handle = handle;
	}

	public async writeLog(chunk: number, id: string, value: any) {
		await this.handle.write(`${chunk}\t${id}\t${value}\n`);
	}
}
