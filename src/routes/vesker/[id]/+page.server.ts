import { getBagById, deleteBag } from '$lib/server/bags';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const bag = await getBagById(params.id);

	if (!bag) {
		error(404, { message: 'Vesken ble ikke funnet' });
	}

	return { bag };
};

export const actions: Actions = {
	delete: async ({ params }) => {
		const bag = await getBagById(params.id);

		if (!bag || !bag._id) {
			error(404, { message: 'Vesken ble ikke funnet' });
		}

		await deleteBag(bag._id);

		redirect(303, '/vesker');
	}
};
