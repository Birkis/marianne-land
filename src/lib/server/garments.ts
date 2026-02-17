import { sanityClient, sanityWriteClient } from './sanity';
import { getAllGarments as getAllGarmentsLocal } from '$lib/data/outfits';
import type { Garment, GarmentZone } from '$lib/data/outfits';
import { removeBackground } from '@imgly/background-removal-node';

function isSanityConfigured(): boolean {
	return !!sanityClient;
}

const GARMENT_PROJECTION = `{
	_id,
	name,
	zone,
	"imageUrl": image.asset->url,
	"overlayUrl": overlay.asset->url,
	color,
	tags,
	notes
}`;

const ALL_GARMENTS_QUERY = `*[_type == "garment"] | order(_createdAt desc) ${GARMENT_PROJECTION}`;

const GARMENTS_BY_ZONE_QUERY = `*[_type == "garment" && zone == $zone] | order(_createdAt desc) ${GARMENT_PROJECTION}`;

export async function getAllGarments(): Promise<Garment[]> {
	if (!isSanityConfigured()) return getAllGarmentsLocal();

	const garments = await sanityClient!.fetch<Garment[]>(ALL_GARMENTS_QUERY);
	return garments ?? [];
}

export async function getGarmentsByZone(zone: GarmentZone): Promise<Garment[]> {
	if (!isSanityConfigured()) return [];

	const garments = await sanityClient!.fetch<Garment[]>(GARMENTS_BY_ZONE_QUERY, { zone });
	return garments ?? [];
}

export async function createGarment(data: {
	name: string;
	zone: GarmentZone;
	color?: string;
	tags?: string[];
	notes?: string;
	imageBuffer: Buffer;
	imageFilename: string;
	imageContentType: string;
}): Promise<Garment> {
	if (!sanityWriteClient) {
		throw new Error('Sanity is not configured');
	}

	const asset = await sanityWriteClient.assets.upload('image', data.imageBuffer, {
		filename: data.imageFilename,
		contentType: data.imageContentType
	});

	let overlayAsset:
		| {
				_id: string;
				url: string;
		  }
		| undefined;

	try {
		const overlayBlob = await removeBackground(data.imageBuffer, {
			model: 'medium',
			output: { format: 'image/png', quality: 0.9 }
		});
		const overlayBuffer = Buffer.from(await overlayBlob.arrayBuffer());

		overlayAsset = await sanityWriteClient.assets.upload('image', overlayBuffer, {
			filename: `${stripExt(data.imageFilename)}-overlay.png`,
			contentType: 'image/png'
		});
	} catch (err) {
		// Best-effort: overlay is optional; keep the original photo.
		console.warn('Background removal failed; creating garment without overlay:', err);
	}

	const doc = await sanityWriteClient.create({
		_type: 'garment',
		name: data.name,
		zone: data.zone,
		color: data.color || undefined,
		tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
		notes: data.notes || undefined,
		image: {
			_type: 'image',
			asset: {
				_type: 'reference',
				_ref: asset._id
			}
		},
		overlay: overlayAsset
			? {
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: overlayAsset._id
					}
				}
			: undefined
	});

	return {
		_id: doc._id,
		name: data.name,
		zone: data.zone,
		imageUrl: asset.url,
		overlayUrl: overlayAsset?.url,
		color: data.color,
		tags: data.tags,
		notes: data.notes
	};
}

export async function deleteGarment(id: string): Promise<void> {
	if (!sanityWriteClient) {
		throw new Error('Sanity is not configured');
	}
	await sanityWriteClient.delete(id);
}

function stripExt(filename: string): string {
	const dot = filename.lastIndexOf('.');
	return dot > 0 ? filename.slice(0, dot) : filename;
}

