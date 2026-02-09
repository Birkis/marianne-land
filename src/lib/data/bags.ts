export interface Brand {
	_id: string;
	name: string;
	logoUrl?: string;
}

export interface Bag {
	_id?: string;
	name: string;
	brand?: Brand;
	color?: string;
	imageUrl: string;
	tags?: string[];
	notes?: string;
}

/** All available tag options for bags. */
export const BAG_TAGS = [
	{ label: 'Hverdag', value: 'hverdag' },
	{ label: 'Fest', value: 'fest' },
	{ label: 'Reise', value: 'reise' },
	{ label: 'Liten', value: 'liten' },
	{ label: 'Stor', value: 'stor' }
] as const;

/** Static fallback — empty since bags are user-generated. */
export function getAllBags(): Bag[] {
	return [];
}
