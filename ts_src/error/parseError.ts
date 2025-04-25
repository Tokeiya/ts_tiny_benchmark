export class ParseError extends Error {
	public constructor(input: string) {
		super(`Parse error: ${input} is not a valid number string`);
		this.name = 'ParseError';
	}
}
