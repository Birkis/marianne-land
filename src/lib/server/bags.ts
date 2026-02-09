import { sanityClient, sanityWriteClient } from './sanity';
import { getAllBags as getAllBagsLocal } from '$lib/data/bags';
import type { Bag } from '$lib/data/bags';

function isSanityConfigured(): boolean {
	try {
		return !!sanityClient.config().projectId;
	} catch {
		return false;
	}
}

// --- GROQ queries ---

const ALL_BAGS_QUERY = `*[_type == "bag"] | order(_createdAt desc) {
	_id,
	name,
	"brand": brand->{_id, name, "logoUrl": logo.asset->url},
	color,
	"imageUrl": image.asset->url,
	tags,
	notes
}`;

const BAG_BY_ID_QUERY = `*[_type == "bag" && _id == $id][0] {
	_id,
	name,
	"brand": brand->{_id, name, "logoUrl": logo.asset->url},
	color,
	"imageUrl": image.asset->url,
	tags,
	notes
}`;

// --- Data fetching functions ---

export async function getAllBags(): Promise<Bag[]> {
	if (!isSanityConfigured()) return getAllBagsLocal();

	const bags = await sanityClient.fetch<Bag[]>(ALL_BAGS_QUERY);
	return bags ?? [];
}

export async function getBagById(id: string): Promise<Bag | undefined> {
	if (!isSanityConfigured()) return undefined;

	const bag = await sanityClient.fetch<Bag | null>(BAG_BY_ID_QUERY, { id });
	return bag ?? undefined;
}

export async function createBag(data: {
	name: string;
	brandId?: string;
	color?: string;
	tags?: string[];
	notes?: string;
	imageBuffer: Buffer;
	imageFilename: string;
	imageContentType: string;
}): Promise<Bag> {
	const asset = await sanityWriteClient.assets.upload('image', data.imageBuffer, {
		filename: data.imageFilename,
		contentType: data.imageContentType
	});

	const doc = await sanityWriteClient.create({
		_type: 'bag',
		name: data.name,
		brand: data.brandId
			? { _type: 'reference', _ref: data.brandId }
			: undefined,
		color: data.color || undefined,
		tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
		notes: data.notes || undefined,
		image: {
			_type: 'image',
			asset: {
				_type: 'reference',
				_ref: asset._id
			}
		}
	});

	return {
		_id: doc._id,
		name: data.name,
		color: data.color,
		imageUrl: asset.url,
		tags: data.tags,
		notes: data.notes
	};
}

export async function deleteBag(id: string): Promise<void> {
	await sanityWriteClient.delete(id);
}
