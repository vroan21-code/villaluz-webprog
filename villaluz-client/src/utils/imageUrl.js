import constants from '../constants';

/** Resolve image path for display (public assets vs server uploads). */
export function resolveImageUrl(image) {
	if (!image) return '';
	if (image.startsWith('http://') || image.startsWith('https://')) return image;
	if (image.startsWith('/uploads/')) return `${constants.SERVER}${image}`;
	return image;
}
