import { getFeaturedTrip, getPastTrips, getAllTrips } from '$lib/data/trips';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const featured = getFeaturedTrip();
	const past = getPastTrips();
	const all = getAllTrips();

	return {
		featured,
		past,
		totalTrips: all.length
	};
};
