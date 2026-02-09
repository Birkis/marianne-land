<script lang="ts">
	import Countdown from '$lib/components/Countdown.svelte';
	import DayTimeline from '$lib/components/DayTimeline.svelte';
	import { isTripActive, isTripUpcoming, isTripPast, formatDateShort } from '$lib/data/trips';

	let { data } = $props();

	let trip = $derived(data.trip);
	let active = $derived(isTripActive(trip));
	let upcoming = $derived(isTripUpcoming(trip));
	let past = $derived(isTripPast(trip));
</script>

<svelte:head>
	<title>{trip.emoji} {trip.destination} — Våre eventyr</title>
	<meta
		name="description"
		content="{trip.tagline} — {formatDateShort(trip.departureDate)} til {formatDateShort(trip.returnDate)}"
	/>
</svelte:head>

<div class="space-y-8">
	<!-- Back link -->
	<nav>
		<a
			href="/"
			class="text-plum/40 hover:text-plum inline-flex items-center gap-1 text-sm transition-colors"
		>
			<span aria-hidden="true">&larr;</span>
			Tilbake til eventyrene
		</a>
	</nav>

	<!-- Trip header -->
	<header class="text-center">
		<div class="mb-2 text-5xl">{trip.emoji}</div>
		<h1 class="font-display text-3xl font-bold text-plum sm:text-4xl">
			{trip.destination}
		</h1>
		<p class="text-plum/50 mt-1 text-sm">{trip.tagline}</p>
		<p class="text-plum/30 mt-2 text-xs">
			{formatDateShort(trip.departureDate)} &mdash; {formatDateShort(trip.returnDate)}
		</p>
	</header>

	<!-- Countdown section -->
	{#if upcoming}
		<section class="rounded-3xl border-2 border-pink/20 bg-white p-6 shadow-sm">
			<Countdown
				targetDate={trip.departureDate}
				destination={trip.destination}
				emoji={trip.emoji}
			/>
		</section>
	{:else if active}
		<section class="rounded-3xl border-2 border-pink/30 bg-pink/10 p-6 text-center">
			<div class="animate-float mb-2 text-4xl">✨</div>
			<p class="font-display text-lg font-bold text-plum">Dere er her!</p>
			<p class="text-plum/50 mt-1 text-sm">Nyt hvert øyeblikk</p>
		</section>
	{:else if past}
		<section class="rounded-3xl border-2 border-pink/20 bg-white p-6 text-center">
			<div class="mb-2 text-4xl">💕</div>
			<p class="font-display text-lg font-bold text-plum">For en tur!</p>
			<p class="text-plum/50 mt-1 text-sm">Gjenopplev overraskelsene nedenfor</p>
		</section>
	{/if}

	<!-- Surprises timeline -->
	<section>
		<h2 class="font-display mb-6 text-xl font-bold text-plum">
			{#if upcoming}
				Det som venter deg
			{:else if active}
				Dagens overraskelser
			{:else}
				Reisen
			{/if}
		</h2>

		<DayTimeline {trip} />
	</section>
</div>
