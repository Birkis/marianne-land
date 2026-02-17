import { getAllOutfits } from '$lib/server/outfits';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const outfits = await getAllOutfits();
	return { outfits };
};

