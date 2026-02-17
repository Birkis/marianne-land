import { getAllGarments } from '$lib/server/garments';
import { createOutfit } from '$lib/server/outfits';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { OutfitGarments } from '$lib/data/outfits';

export const load: PageServerLoad = async () => {
	const garments = await getAllGarments();
	return { garments };
};

function toId(value: FormDataEntryValue | null): string | undefined {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	return trimmed ? trimmed : undefined;
}

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();

		const name = formData.get('name');
		if (!name || typeof name !== 'string' || !name.trim()) {
			return fail(400, { error: 'Antrekket trenger et navn' });
		}

		const garments: OutfitGarments = {
			hodeplagg: toId(formData.get('hodeplaggId')),
			overdel: toId(formData.get('overdelId')),
			underdel: toId(formData.get('underdelId')),
			sko: toId(formData.get('skoId')),
			tilbehor: toId(formData.get('tilbehorId'))
		};

		try {
			const created = await createOutfit({ name: name.trim(), garments });
			throw redirect(303, `/antrekk/${created._id}`);
		} catch (err) {
			console.error('Failed to create outfit:', err);
			return fail(500, { error: 'Noe gikk galt. Prøv igjen.' });
		}
	}
};

