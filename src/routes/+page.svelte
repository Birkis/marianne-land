<script lang="ts">
	import Countdown from '$lib/components/Countdown.svelte';
	import TripCard from '$lib/components/TripCard.svelte';
	import { isTripActive, isTripUpcoming } from '$lib/data/trips';

	let { data } = $props();
</script>

<svelte:head>
	<title>Våre eventyr</title>
	<meta name="description" content="Nedtelling til vårt neste eventyr sammen." />
</svelte:head>

<div class="space-y-10">
	<!-- Header -->
	<header class="pt-4 text-center">
		<h1 class="font-display text-3xl font-bold text-plum sm:text-4xl">
			Våre eventyr
		</h1>
		<p class="text-plum/50 mt-2 text-sm">
			Hver tur er en historie som venter på å skje
		</p>
	</header>

	<!-- Featured trip countdown -->
	{#if data.featured}
		{@const trip = data.featured}
		{@const active = isTripActive(trip)}
		{@const upcoming = isTripUpcoming(trip)}

		<section class="rounded-3xl border-2 border-pink/20 bg-white p-6 shadow-sm">
			<Countdown
				targetDate={trip.departureDate}
				destination={trip.destination}
				emoji={trip.emoji}
			/>

			{#if active}
				<div class="mt-6 text-center">
					<a
						href="/trip/{trip.slug}"
						class="inline-flex items-center gap-2 rounded-full bg-pink px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-pink-soft hover:shadow-lg active:scale-95"
					>
						Se overraskelsene
						<span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			{:else if upcoming}
				<div class="mt-6 text-center">
					<a
						href="/trip/{trip.slug}"
						class="inline-flex items-center gap-2 rounded-full border-2 border-pink/20 bg-blush px-6 py-3 text-sm font-semibold text-plum/60 transition-all hover:border-pink/40 hover:text-plum active:scale-95"
					>
						Titt på reiseplanen
						<span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			{/if}
		</section>
	{:else}
		<!-- No upcoming trip -->
		<section class="rounded-3xl border-2 border-pink/20 bg-white p-8 text-center shadow-sm">
			<div class="mb-4 text-5xl">✈️</div>
			<h2 class="font-display text-xl font-bold text-plum">Ingen turer planlagt ennå</h2>
			<p class="text-plum/50 mt-2 text-sm">Men neste eventyr er alltid rett rundt hjørnet...</p>
		</section>
	{/if}

	<!-- Past trips -->
	{#if data.past.length > 0}
		<section>
			<h2 class="font-display mb-4 text-lg font-bold text-plum/70">
				Tidligere eventyr
			</h2>
			<div class="grid gap-3">
				{#each data.past as trip (trip.slug)}
					<TripCard {trip} />
				{/each}
			</div>
		</section>
	{/if}
</div>
