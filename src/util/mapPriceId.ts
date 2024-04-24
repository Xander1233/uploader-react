export function mapPriceId(name: string, interval: "month" | "year"): string {
	switch (name) {
		case "base": return interval === "month" ? "price_1OrhocEbfEExjZVcHIiMYvwk" : "price_1OrhtzEbfEExjZVcaK8HD69C";
		case "standard": return interval === "month" ? "price_1Orhr6EbfEExjZVcIFD0JrvY" : "price_1OrhvfEbfEExjZVc128jvppy";
		case "plus": return interval === "month" ? "price_1Orhs5EbfEExjZVcLPTo1voo" : "price_1OrhwgEbfEExjZVcQOgZQZ2B";
		case "business": return interval === "month" ? "price_1OrhxMEbfEExjZVcwSbRQhPS" : "price_1Orhy2EbfEExjZVcAuLQCTeP";
	}

	return "";
}