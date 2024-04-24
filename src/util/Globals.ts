export class Globals {

	public static readonly shared = new Globals();

	public readonly API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? "http://localhost:8000/";

	private constructor() {}
}