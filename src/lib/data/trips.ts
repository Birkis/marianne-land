import tripsData from './trips.json';

export interface Surprise {
	id: number;
	unlockDate: string;
	type: 'activity' | 'restaurant' | 'surprise';
	title: string;
	description: string;
	icon: string;
}

export interface FlightInfo {
	id: string;
	direction: 'outbound' | 'return';
	airline: string;
	flightNumber: string;
	date: string;
	departureAirport: string;
	departureTime: string;
	arrivalAirport: string;
	arrivalTime: string;
	terminal?: string;
	gate?: string;
	bookingReference?: string;
	seatInfo?: string;
}

export interface Trip {
	_id?: string;
	slug: string;
	destination: string;
	emoji: string;
	tagline: string;
	departureDate: string;
	returnDate: string;
	flights?: FlightInfo[];
	surprises: Surprise[];
	photos?: string[];
}

function toDateOnly(dateStr: string): Date {
	const [y, m, d] = dateStr.split('-').map(Number);
	return new Date(y, m - 1, d);
}

function todayDateOnly(): Date {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getAllTrips(): Trip[] {
	return tripsData.trips as Trip[];
}

export function getTripBySlug(slug: string): Trip | undefined {
	return getAllTrips().find((t) => t.slug === slug);
}

export function getActiveTrip(): Trip | undefined {
	const today = todayDateOnly();
	return getAllTrips().find((trip) => {
		const departure = toDateOnly(trip.departureDate);
		const returnDate = toDateOnly(trip.returnDate);
		return today >= departure && today <= returnDate;
	});
}

export function getUpcomingTrip(): Trip | undefined {
	const today = todayDateOnly();
	const upcoming = getAllTrips()
		.filter((trip) => toDateOnly(trip.departureDate) > today)
		.sort(
			(a, b) => toDateOnly(a.departureDate).getTime() - toDateOnly(b.departureDate).getTime()
		);
	return upcoming[0];
}

export function getUpcomingTrips(): Trip[] {
	const today = todayDateOnly();
	return getAllTrips()
		.filter((trip) => toDateOnly(trip.departureDate) > today)
		.sort(
			(a, b) => toDateOnly(a.departureDate).getTime() - toDateOnly(b.departureDate).getTime()
		);
}

export function getPastTrips(): Trip[] {
	const today = todayDateOnly();
	return getAllTrips()
		.filter((trip) => toDateOnly(trip.returnDate) < today)
		.sort(
			(a, b) => toDateOnly(b.departureDate).getTime() - toDateOnly(a.departureDate).getTime()
		);
}

export function getFeaturedTrip(): Trip | undefined {
	return getActiveTrip() ?? getUpcomingTrip();
}

export function isSurpriseUnlocked(unlockDate: string): boolean {
	return todayDateOnly() >= toDateOnly(unlockDate);
}

export function isTripActive(trip: Trip): boolean {
	const today = todayDateOnly();
	return today >= toDateOnly(trip.departureDate) && today <= toDateOnly(trip.returnDate);
}

export function isTripUpcoming(trip: Trip): boolean {
	return todayDateOnly() < toDateOnly(trip.departureDate);
}

export function isTripPast(trip: Trip): boolean {
	return todayDateOnly() > toDateOnly(trip.returnDate);
}

export function getTripDays(trip: Trip): { date: string; surprises: Surprise[] }[] {
	const start = toDateOnly(trip.departureDate);
	const end = toDateOnly(trip.returnDate);
	const days: { date: string; surprises: Surprise[] }[] = [];

	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
		days.push({
			date: dateStr,
			surprises: trip.surprises.filter((s) => s.unlockDate === dateStr)
		});
	}

	return days;
}

export function formatDate(dateStr: string): string {
	return toDateOnly(dateStr).toLocaleDateString('nb-NO', {
		weekday: 'long',
		day: 'numeric',
		month: 'long'
	});
}

export function formatDateShort(dateStr: string): string {
	return toDateOnly(dateStr).toLocaleDateString('nb-NO', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}
