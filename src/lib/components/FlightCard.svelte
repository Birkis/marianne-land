<script lang="ts">
	import type { FlightInfo } from '$lib/data/trips';
	import { formatDate } from '$lib/data/trips';

	let { flight }: { flight: FlightInfo } = $props();

	let directionLabel = $derived(flight.direction === 'outbound' ? 'Utreise' : 'Retur');
	let directionIcon = $derived(flight.direction === 'outbound' ? '✈️' : '🔙');
</script>

<div class="overflow-hidden rounded-2xl border-2 border-pink/20 bg-white shadow-sm">
	<!-- Header bar -->
	<div class="flex items-center justify-between border-b border-dashed border-pink/20 bg-blush px-4 py-2">
		<div class="flex items-center gap-2">
			<span class="text-base">{directionIcon}</span>
			<span class="text-xs font-semibold uppercase tracking-wide text-plum/60">{directionLabel}</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-xs font-medium text-plum/50">{flight.airline}</span>
			<span class="rounded-full bg-pink/10 px-2 py-0.5 text-xs font-bold text-plum">{flight.flightNumber}</span>
		</div>
	</div>

	<!-- Airport codes + times -->
	<div class="flex items-center justify-between px-5 py-4">
		<!-- Departure -->
		<div class="text-center">
			<p class="font-display text-2xl font-bold text-plum">{flight.departureAirport}</p>
			<p class="text-lg font-semibold text-plum/70">{flight.departureTime}</p>
		</div>

		<!-- Flight path -->
		<div class="flex flex-1 items-center px-4">
			<div class="h-px flex-1 bg-pink/30"></div>
			<div class="mx-2 text-lg text-pink/60">✈</div>
			<div class="h-px flex-1 bg-pink/30"></div>
		</div>

		<!-- Arrival -->
		<div class="text-center">
			<p class="font-display text-2xl font-bold text-plum">{flight.arrivalAirport}</p>
			<p class="text-lg font-semibold text-plum/70">{flight.arrivalTime}</p>
		</div>
	</div>

	<!-- Date -->
	<div class="border-t border-dashed border-pink/20 px-5 py-2">
		<p class="text-center text-xs capitalize text-plum/50">{formatDate(flight.date)}</p>
	</div>

	<!-- Optional details -->
	{#if flight.terminal || flight.gate || flight.bookingReference || flight.seatInfo}
		<div class="flex flex-wrap gap-x-5 gap-y-1 border-t border-dashed border-pink/20 px-5 py-2.5">
			{#if flight.terminal}
				<div class="text-xs">
					<span class="text-plum/40">Terminal</span>
					<span class="ml-1 font-semibold text-plum/70">{flight.terminal}</span>
				</div>
			{/if}
			{#if flight.gate}
				<div class="text-xs">
					<span class="text-plum/40">Gate</span>
					<span class="ml-1 font-semibold text-plum/70">{flight.gate}</span>
				</div>
			{/if}
			{#if flight.bookingReference}
				<div class="text-xs">
					<span class="text-plum/40">Booking</span>
					<span class="ml-1 font-semibold text-plum/70">{flight.bookingReference}</span>
				</div>
			{/if}
			{#if flight.seatInfo}
				<div class="text-xs">
					<span class="text-plum/40">Seter</span>
					<span class="ml-1 font-semibold text-plum/70">{flight.seatInfo}</span>
				</div>
			{/if}
		</div>
	{/if}
</div>
