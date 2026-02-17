import { getTripBySlug } from '$lib/server/trips';
import { getAllBags } from '$lib/server/bags';
import { sanityWriteClient } from '$lib/server/sanity';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [trip, allBags] = await Promise.all([getTripBySlug(params.slug), getAllBags()]);

	if (!trip) {
		error(404, { message: 'Trip not found' });
	}

	return { trip, allBags };
};

export const actions: Actions = {
	upload: async ({ request, params }) => {
		const trip = await getTripBySlug(params.slug);

		if (!trip) {
			return fail(404, { error: 'Trip not found' });
		}

		// Only allow uploads for active or past trips
		const today = new Date();
		const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const [dy, dm, dd] = trip.departureDate.split('-').map(Number);
		const departure = new Date(dy, dm - 1, dd);

		if (todayOnly < departure) {
			return fail(403, { error: 'Kan ikke laste opp bilder til en fremtidig tur' });
		}

		if (!trip._id) {
			return fail(500, { error: 'Trip mangler Sanity-ID. Er Sanity konfigurert?' });
		}

		if (!sanityWriteClient) {
			return fail(500, { error: 'Sanity er ikke konfigurert' });
		}

		const formData = await request.formData();
		const files = formData.getAll('photos');

		if (!files || files.length === 0) {
			return fail(400, { error: 'Ingen bilder valgt' });
		}

		const imageRefs: Array<{
			_type: 'image';
			_key: string;
			asset: { _type: 'reference'; _ref: string };
		}> = [];

		for (const file of files) {
			if (!(file instanceof File) || !file.type.startsWith('image/')) {
				continue;
			}

			const buffer = Buffer.from(await file.arrayBuffer());
			const asset = await sanityWriteClient.assets.upload('image', buffer, {
				filename: file.name,
				contentType: file.type
			});

			imageRefs.push({
				_type: 'image',
				_key: crypto.randomUUID().slice(0, 12),
				asset: {
					_type: 'reference',
					_ref: asset._id
				}
			});
		}

		if (imageRefs.length === 0) {
			return fail(400, { error: 'Ingen gyldige bilder funnet' });
		}

		await sanityWriteClient
			.patch(trip._id)
			.setIfMissing({ photos: [] })
			.append('photos', imageRefs)
			.commit();

		return { success: true, count: imageRefs.length };
	},

	addBag: async ({ request, params }) => {
		const trip = await getTripBySlug(params.slug);

		if (!trip || !trip._id) {
			return fail(404, { error: 'Trip not found' });
		}

		if (!sanityWriteClient) {
			return fail(500, { error: 'Sanity er ikke konfigurert' });
		}

		const formData = await request.formData();
		const bagId = formData.get('bagId');

		if (!bagId || typeof bagId !== 'string') {
			return fail(400, { error: 'Ingen veske valgt' });
		}

		// Check if already added (use write client to avoid CDN staleness)
		const rawTrip = await sanityWriteClient.getDocument(trip._id);
		const selectedBags = (rawTrip?.selectedBags ?? []) as Array<{ _ref: string }>;
		const alreadyAdded = selectedBags.some((b) => b._ref === bagId);
		if (alreadyAdded) {
			return fail(400, { error: 'Vesken er allerede lagt til' });
		}

		await sanityWriteClient
			.patch(trip._id)
			.setIfMissing({ selectedBags: [] })
			.append('selectedBags', [
				{ _type: 'reference', _ref: bagId, _key: crypto.randomUUID().slice(0, 12) }
			])
			.commit();

		return { success: true };
	},

	removeBag: async ({ request, params }) => {
		const trip = await getTripBySlug(params.slug);

		if (!trip || !trip._id) {
			return fail(404, { error: 'Trip not found' });
		}

		if (!sanityWriteClient) {
			return fail(500, { error: 'Sanity er ikke konfigurert' });
		}

		const formData = await request.formData();
		const bagId = formData.get('bagId');

		if (!bagId || typeof bagId !== 'string') {
			return fail(400, { error: 'Ingen veske valgt' });
		}

		// Fetch the raw document to find the array key for this reference
		const rawTrip = await sanityWriteClient.getDocument(trip._id);
		const selectedBags = (rawTrip?.selectedBags ?? []) as Array<{ _key: string; _ref: string }>;
		const entry = selectedBags.find((b) => b._ref === bagId);

		if (!entry) {
			return fail(400, { error: 'Vesken er ikke på listen' });
		}

		await sanityWriteClient
			.patch(trip._id)
			.unset([`selectedBags[_key=="${entry._key}"]`])
			.commit();

		return { success: true };
	}
};
