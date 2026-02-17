export type GarmentZone = 'hodeplagg' | 'overdel' | 'underdel' | 'sko' | 'tilbehor';

export const GARMENT_ZONES: Array<{ value: GarmentZone; label: string }> = [
	{ value: 'hodeplagg', label: 'Hodeplagg' },
	{ value: 'overdel', label: 'Overdel' },
	{ value: 'underdel', label: 'Underdel' },
	{ value: 'sko', label: 'Sko' },
	{ value: 'tilbehor', label: 'Tilbehør' }
];

export const GARMENT_TAGS = [
	{ label: 'Hverdag', value: 'hverdag' },
	{ label: 'Fest', value: 'fest' },
	{ label: 'Reise', value: 'reise' },
	{ label: 'Jobb', value: 'jobb' },
	{ label: 'Trening', value: 'trening' },
	{ label: 'Varmt', value: 'varmt' },
	{ label: 'Kaldt', value: 'kaldt' },
	{ label: 'Regn', value: 'regn' }
] as const;

export interface Garment {
	_id: string;
	name: string;
	zone: GarmentZone;
	imageUrl: string;
	overlayUrl?: string;
	color?: string;
	tags?: string[];
	notes?: string;
}

export type OutfitGarments = Record<GarmentZone, string | undefined>;
export type ResolvedOutfitGarments = Record<GarmentZone, Garment | undefined>;

export interface Outfit {
	_id: string;
	name: string;
	garments: OutfitGarments; // garment _id per zone
	resolvedGarments?: ResolvedOutfitGarments; // populated on fetch
}

/** Static fallback — empty since garments/outfits are user-generated. */
export function getAllGarments(): Garment[] {
	return [];
}

/** Static fallback — empty since garments/outfits are user-generated. */
export function getAllOutfits(): Outfit[] {
	return [];
}

