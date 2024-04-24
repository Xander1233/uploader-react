export function uploadTokenUses(uses: number) {
	if (uses < 0) return "∞";
	return `${uses}`;
}