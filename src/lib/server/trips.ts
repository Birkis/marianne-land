import { sanityClient } from './sanity';
import {
	getAllTrips as getAllTripsLocal,
	getTripBySlug as getTripBySlugLocal,
	getFeaturedTrip as getFeaturedTripLocal,
	getPastTrips as getPastTripsLocal,
	getUpcomingTrips as getUpcomingTripsLocal
} from '$lib/data/trips';
import type { Trip } from '$lib/data/trips';

/**
 * Check if Sanity is configured by verifying project ID exists.
 * Falls back to static JSON data when Sanity isn't set up.
 */
function isSanityConfigured(): boolean {
	return !!sanityClient;
}

// --- GROQ queries ---

const TRIPS_QUERY = `*[_type == "trip" && !(_id in path("drafts.**"))] | order(departureDate desc) {
	"slug": slug.current,
	destination,
	emoji,
	tagline,
	departureDate,
	returnDate,
	"flights": flights[] {
		"id": _key,
		direction,
		airline,
		flightNumber,
		date,
		departureAirport,
		departureTime,
		arrivalAirport,
		arrivalTime,
		terminal,
		gate,
		bookingReference,
		seatInfo
	},
	"surprises": surprises[] {
		"id": _key,
		unlockDate,
		type,
		title,
		description,
		icon
	},
	"selectedBags": selectedBags[]->{_id, name, "brand": brand->{_id, name, "logoUrl": logo.asset->url}, color, "imageUrl": image.asset->url},
	"photos": photos[].asset->url
}`;

const TRIP_BY_SLUG_QUERY = `*[_type == "trip" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
	_id,
	"slug": slug.current,
	destination,
	emoji,
	tagline,
	departureDate,
	returnDate,
	"flights": flights[] {
		"id": _key,
		direction,
		airline,
		flightNumber,
		date,
		departureAirport,
		departureTime,
		arrivalAirport,
		arrivalTime,
		terminal,
		gate,
		bookingReference,
		seatInfo
	},
	"surprises": surprises[] {
		"id": _key,
		unlockDate,
		type,
		title,
		description,
		icon
	},
	"selectedBags": selectedBags[]->{_id, name, "brand": brand->{_id, name, "logoUrl": logo.asset->url}, color, "imageUrl": image.asset->url},
	"photos": photos[].asset->url
}`;

// --- Data fetching functions ---

export async function getAllTrips(): Promise<Trip[]> {
	if (!isSanityConfigured()) return getAllTripsLocal();

	const trips = await sanityClient!.fetch<Trip[]>(TRIPS_QUERY);
	return trips ?? [];
}

export async function getTripBySlug(slug: string): Promise<Trip | undefined> {
	if (!isSanityConfigured()) return getTripBySlugLocal(slug);

	const trip = await sanityClient!.fetch<Trip | null>(TRIP_BY_SLUG_QUERY, { slug });
	return trip ?? undefined;
}

export async function getFeaturedTrip(): Promise<Trip | undefined> {
	if (!isSanityConfigured()) return getFeaturedTripLocal();

	const trips = await getAllTrips();
	const today = todayDateOnly();

	// Active trip first
	const active = trips.find((trip) => {
		const dep = toDateOnly(trip.departureDate);
		const ret = toDateOnly(trip.returnDate);
		return today >= dep && today <= ret;
	});
	if (active) return active;

	// Otherwise upcoming
	const upcoming = trips
		.filter((trip) => toDateOnly(trip.departureDate) > today)
		.sort((a, b) => toDateOnly(a.departureDate).getTime() - toDateOnly(b.departureDate).getTime());
	return upcoming[0];
}

export async function getUpcomingTrips(): Promise<Trip[]> {
	if (!isSanityConfigured()) return getUpcomingTripsLocal();

	const trips = await getAllTrips();
	const today = todayDateOnly();

	return trips
		.filter((trip) => toDateOnly(trip.departureDate) > today)
		.sort((a, b) => toDateOnly(a.departureDate).getTime() - toDateOnly(b.departureDate).getTime());
}

export async function getPastTrips(): Promise<Trip[]> {
	if (!isSanityConfigured()) return getPastTripsLocal();

	const trips = await getAllTrips();
	const today = todayDateOnly();

	return trips
		.filter((trip) => toDateOnly(trip.returnDate) < today)
		.sort((a, b) => toDateOnly(b.departureDate).getTime() - toDateOnly(a.departureDate).getTime());
}

// --- Date helpers (mirror of data/trips.ts) ---

function toDateOnly(dateStr: string): Date {
	const [y, m, d] = dateStr.split('-').map(Number);
	return new Date(y, m - 1, d);
}

function todayDateOnly(): Date {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
