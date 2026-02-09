import { getTripBySlug } from '$lib/data/trips';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const trip = getTripBySlug(params.slug);

	if (!trip) {
		error(404, { message: 'Trip not found' });
	}

	return { trip };
};
