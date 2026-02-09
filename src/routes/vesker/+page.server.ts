import { getAllBags, createBag } from '$lib/server/bags';
import { getAllBrands, createBrand } from '$lib/server/brands';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const [bags, brands] = await Promise.all([getAllBags(), getAllBrands()]);
	return { bags, brands };
};

export const actions: Actions = {
	add: async ({ request }) => {
		const formData = await request.formData();

		const name = formData.get('name');
		const brandId = formData.get('brandId');
		const newBrandName = formData.get('newBrandName');
		const color = formData.get('color');
		const tags = formData.getAll('tags');
		const notes = formData.get('notes');
		const imageFile = formData.get('image');

		if (!name || typeof name !== 'string' || !name.trim()) {
			return fail(400, { error: 'Vesken trenger et navn' });
		}

		if (!(imageFile instanceof File) || !imageFile.type.startsWith('image/') || imageFile.size === 0) {
			return fail(400, { error: 'Du må legge til et bilde av vesken' });
		}

		// Resolve brand: use existing ID, or create a new brand inline
		let resolvedBrandId: string | undefined;

		if (typeof newBrandName === 'string' && newBrandName.trim()) {
			try {
				const created = await createBrand(newBrandName);
				resolvedBrandId = created._id;
			} catch (err) {
				console.error('Failed to create brand:', err);
				return fail(500, { error: 'Kunne ikke opprette nytt merke. Prøv igjen.' });
			}
		} else if (typeof brandId === 'string' && brandId.trim()) {
			resolvedBrandId = brandId.trim();
		}

		try {
			const buffer = Buffer.from(await imageFile.arrayBuffer());

			await createBag({
				name: name.trim(),
				brandId: resolvedBrandId,
				color: typeof color === 'string' ? color.trim() : undefined,
				tags: tags.filter((t): t is string => typeof t === 'string' && t.length > 0),
				notes: typeof notes === 'string' ? notes.trim() : undefined,
				imageBuffer: buffer,
				imageFilename: imageFile.name,
				imageContentType: imageFile.type
			});

			return { success: true };
		} catch (err) {
			console.error('Failed to create bag:', err);
			return fail(500, { error: 'Noe gikk galt. Prøv igjen.' });
		}
	}
};
