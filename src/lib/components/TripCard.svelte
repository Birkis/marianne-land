<script lang="ts">
	import type { Trip } from '$lib/data/trips';
	import { formatDateShort, isTripActive, isTripPast } from '$lib/data/trips';

	let { trip }: { trip: Trip } = $props();

	let status = $derived(
		isTripActive(trip) ? 'active' : isTripPast(trip) ? 'past' : 'upcoming'
	);
</script>

<a
	href="/trip/{trip.slug}"
	class="group block rounded-2xl border-2 border-pink/15 bg-white p-5 shadow-sm transition-all hover:border-pink hover:shadow-md"
>
	<div class="mb-3 flex items-center justify-between">
		<span class="text-3xl">{trip.emoji}</span>
		{#if status === 'active'}
			<span class="rounded-full bg-pink/20 px-2.5 py-0.5 text-xs font-semibold text-plum">
				Nå!
			</span>
		{:else if status === 'upcoming'}
			<span class="rounded-full bg-plum/10 px-2.5 py-0.5 text-xs font-semibold text-plum/60">
				Kommende
			</span>
		{/if}
	</div>

	<h3 class="font-display text-lg font-bold text-plum group-hover:text-pink transition-colors">
		{trip.destination}
	</h3>

	<p class="text-plum/50 mt-0.5 text-sm">{trip.tagline}</p>

	<p class="text-plum/40 mt-3 text-xs">
		{formatDateShort(trip.departureDate)} &mdash; {formatDateShort(trip.returnDate)}
	</p>
</a>
