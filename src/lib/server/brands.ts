import { sanityClient, sanityWriteClient } from './sanity';
import type { Brand } from '$lib/data/bags';

function isSanityConfigured(): boolean {
	try {
		return !!sanityClient.config().projectId;
	} catch {
		return false;
	}
}

const ALL_BRANDS_QUERY = `*[_type == "brand"] | order(name asc) {
	_id,
	name,
	"logoUrl": logo.asset->url
}`;

export async function getAllBrands(): Promise<Brand[]> {
	if (!isSanityConfigured()) return [];

	const brands = await sanityClient.fetch<Brand[]>(ALL_BRANDS_QUERY);
	return brands ?? [];
}

export async function createBrand(name: string): Promise<Brand> {
	const doc = await sanityWriteClient.create({
		_type: 'brand',
		name: name.trim()
	});

	return {
		_id: doc._id,
		name: name.trim()
	};
}
