import { getAllGarments, createGarment } from '$lib/server/garments';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { GarmentZone } from '$lib/data/outfits';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export const load: PageServerLoad = async () => {
	const garments = await getAllGarments();
	return { garments };
};

function isGarmentZone(value: unknown): value is GarmentZone {
	return value === 'hodeplagg' || value === 'overdel' || value === 'underdel' || value === 'sko' || value === 'tilbehor';
}

export const actions: Actions = {
	add: async ({ request }) => {
		const formData = await request.formData();

		const name = formData.get('name');
		const zone = formData.get('zone');
		const color = formData.get('color');
		const tags = formData.getAll('tags');
		const notes = formData.get('notes');
		const imageFile = formData.get('image');
	const overlayFile = formData.get('overlay');

		if (!name || typeof name !== 'string' || !name.trim()) {
			return fail(400, { error: 'Plagget trenger et navn' });
		}

		if (!isGarmentZone(zone)) {
			return fail(400, { error: 'Du må velge en kategori' });
		}

		if (!(imageFile instanceof File) || !imageFile.type.startsWith('image/') || imageFile.size === 0) {
			return fail(400, { error: 'Du må legge til et bilde av plagget' });
		}

		if (imageFile.size > MAX_IMAGE_BYTES) {
			return fail(400, { error: 'Bildet er for stort. Prøv et mindre bilde (maks 10MB).' });
		}

		if (overlayFile instanceof File && overlayFile.size > MAX_IMAGE_BYTES) {
			return fail(400, { error: 'Overlay-bildet er for stort. Prøv et mindre bilde (maks 10MB).' });
		}

		try {
			const buffer = Buffer.from(await imageFile.arrayBuffer());

			let overlayBuffer: Buffer | undefined;
			let overlayFilename: string | undefined;
			let overlayContentType: string | undefined;

			if (overlayFile instanceof File && overlayFile.size > 0) {
				if (overlayFile.type !== 'image/png') {
					return fail(400, { error: 'Overlay må være en PNG med transparent bakgrunn.' });
				}
				overlayBuffer = Buffer.from(await overlayFile.arrayBuffer());
				overlayFilename = overlayFile.name;
				overlayContentType = overlayFile.type;
			}

			await createGarment({
				name: name.trim(),
				zone,
				color: typeof color === 'string' ? color.trim() : undefined,
				tags: tags.filter((t): t is string => typeof t === 'string' && t.length > 0),
				notes: typeof notes === 'string' ? notes.trim() : undefined,
				imageBuffer: buffer,
				imageFilename: imageFile.name,
				imageContentType: imageFile.type,
				overlayBuffer,
				overlayFilename,
				overlayContentType
			});

			return { success: true };
		} catch (err) {
			console.error('Failed to create garment:', err);
			return fail(500, { error: 'Noe gikk galt. Prøv igjen.' });
		}
	}
};

