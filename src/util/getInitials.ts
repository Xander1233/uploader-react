export function getInitials(name: string): string {
	// Split name into words
	const words = name.split(' ');
	
	if (words.length === 1) {
		// If only one word, check if its in CamelCase
		// If it is, split it into separate words
		const camelCaseWords = name.split(/(?=[A-Z])/);
		if (camelCaseWords.length > 1) {
			return getInitials(camelCaseWords.join(' '));
		}

		// If not, return the first two letters
		return name.substring(0, 2).toUpperCase();
	}

	let initials = "";

	// Get the first letter of each word
	let higherBound = Math.min(words.length, 2);

	for (let i = 0; i < higherBound; i++) {
		// if the string is empty, skip it
		if (words[i].length === 0) higherBound++;

		initials += words[i][0];
	}

	return initials.toUpperCase();
}