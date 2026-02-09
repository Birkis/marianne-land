import { getFeaturedTrip, getUpcomingTrips, getPastTrips } from '$lib/server/trips';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [featured, upcoming, past] = await Promise.all([
		getFeaturedTrip(),
		getUpcomingTrips(),
		getPastTrips()
	]);

	return {
		featured,
		upcoming,
		past
	};
};
