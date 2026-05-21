export function slugify(text) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function parseContentParagraphs(raw) {
	return raw
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);
}
