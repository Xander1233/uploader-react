export function convertTimestamp(timestamp: string): string {
	const date = new Date(timestamp);

	return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}