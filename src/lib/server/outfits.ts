import { sanityClient, sanityWriteClient } from './sanity';
import { getAllOutfits as getAllOutfitsLocal } from '$lib/data/outfits';
import type { GarmentZone, Outfit, OutfitGarments } from '$lib/data/outfits';

function isSanityConfigured(): boolean {
	return !!sanityClient;
}

const GARMENT_PROJECTION = `{
	_id,
	name,
	zone,
	"imageUrl": image.asset->url,
	color,
	tags,
	notes
}`;

const OUTFIT_PROJECTION = `{
	_id,
	name,
	"garments": {
		"hodeplagg": hodeplagg._ref,
		"overdel": overdel._ref,
		"underdel": underdel._ref,
		"sko": sko._ref,
		"tilbehor": tilbehor._ref
	},
	"resolvedGarments": {
		"hodeplagg": hodeplagg->${GARMENT_PROJECTION},
		"overdel": overdel->${GARMENT_PROJECTION},
		"underdel": underdel->${GARMENT_PROJECTION},
		"sko": sko->${GARMENT_PROJECTION},
		"tilbehor": tilbehor->${GARMENT_PROJECTION}
	}
}`;

const ALL_OUTFITS_QUERY = `*[_type == "outfit"] | order(_createdAt desc) ${OUTFIT_PROJECTION}`;

const OUTFIT_BY_ID_QUERY = `*[_type == "outfit" && _id == $id][0] ${OUTFIT_PROJECTION}`;

export async function getAllOutfits(): Promise<Outfit[]> {
	if (!isSanityConfigured()) return getAllOutfitsLocal();

	const outfits = await sanityClient!.fetch<Outfit[]>(ALL_OUTFITS_QUERY);
	return outfits ?? [];
}

export async function getOutfitById(id: string): Promise<Outfit | undefined> {
	if (!isSanityConfigured()) return undefined;

	const outfit = await sanityClient!.fetch<Outfit | null>(OUTFIT_BY_ID_QUERY, { id });
	return outfit ?? undefined;
}

export async function createOutfit(data: {
	name: string;
	garments: OutfitGarments;
}): Promise<Outfit> {
	if (!sanityWriteClient) {
		throw new Error('Sanity is not configured');
	}

	const doc = await sanityWriteClient.create({
		_type: 'outfit',
		name: data.name,
		hodeplagg: toRef(data.garments.hodeplagg),
		overdel: toRef(data.garments.overdel),
		underdel: toRef(data.garments.underdel),
		sko: toRef(data.garments.sko),
		tilbehor: toRef(data.garments.tilbehor)
	});

	const created = await getOutfitById(doc._id);
	if (!created) {
		// Should not happen; but return a minimal object if it does.
		return {
			_id: doc._id,
			name: data.name,
			garments: data.garments
		};
	}
	return created;
}

export async function updateOutfit(
	id: string,
	data: { name?: string; garments: OutfitGarments }
): Promise<Outfit> {
	if (!sanityWriteClient) {
		throw new Error('Sanity is not configured');
	}

	const zones: GarmentZone[] = ['hodeplagg', 'overdel', 'underdel', 'sko', 'tilbehor'];

	const set: Record<string, unknown> = {};
	const unset: string[] = [];

	if (typeof data.name === 'string') {
		set.name = data.name.trim();
	}

	for (const zone of zones) {
		const ref = toRef(data.garments[zone]);
		if (ref) {
			set[zone] = ref;
		} else {
			unset.push(zone);
		}
	}

	let patch = sanityWriteClient.patch(id);
	if (Object.keys(set).length > 0) patch = patch.set(set);
	if (unset.length > 0) patch = patch.unset(unset);
	await patch.commit();

	const updated = await getOutfitById(id);
	if (!updated) throw new Error('Failed to load updated outfit');
	return updated;
}

export async function deleteOutfit(id: string): Promise<void> {
	if (!sanityWriteClient) {
		throw new Error('Sanity is not configured');
	}
	await sanityWriteClient.delete(id);
}

function toRef(id: string | undefined) {
	if (!id) return undefined;
	return { _type: 'reference', _ref: id };
}

