import { getAllGarments } from '$lib/server/garments';
import { deleteOutfit, getOutfitById, updateOutfit } from '$lib/server/outfits';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { OutfitGarments } from '$lib/data/outfits';

export const load: PageServerLoad = async ({ params }) => {
	const [garments, outfit] = await Promise.all([getAllGarments(), getOutfitById(params.id)]);

	if (!outfit) throw error(404, 'Fant ikke antrekket');
	return { garments, outfit };
};

function toId(value: FormDataEntryValue | null): string | undefined {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	return trimmed ? trimmed : undefined;
}

export const actions: Actions = {
	update: async ({ request, params }) => {
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
			await updateOutfit(params.id, { name: name.trim(), garments });
			return { success: true };
		} catch (err) {
			console.error('Failed to update outfit:', err);
			return fail(500, { error: 'Noe gikk galt. Prøv igjen.' });
		}
	},

	delete: async ({ params }) => {
		try {
			await deleteOutfit(params.id);
			throw redirect(303, '/antrekk');
		} catch (err) {
			console.error('Failed to delete outfit:', err);
			return fail(500, { error: 'Kunne ikke slette antrekket. Prøv igjen.' });
		}
	}
};

