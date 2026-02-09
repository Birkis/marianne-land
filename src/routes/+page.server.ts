import { getFeaturedTrip, getPastTrips, getAllTrips } from '$lib/server/trips';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [featured, past, all] = await Promise.all([
		getFeaturedTrip(),
		getPastTrips(),
		getAllTrips()
	]);

	return {
		featured,
		past,
		totalTrips: all.length
	};
};
