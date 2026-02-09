<script lang="ts">
	import { enhance } from '$app/forms';
	import Countdown from '$lib/components/Countdown.svelte';
	import DayTimeline from '$lib/components/DayTimeline.svelte';
	import FlightCard from '$lib/components/FlightCard.svelte';
	import ImageGrid from '$lib/components/ImageGrid.svelte';
	import { isTripActive, isTripUpcoming, isTripPast, formatDateShort } from '$lib/data/trips';

	let { data, form } = $props();

	let trip = $derived(data.trip);
	let active = $derived(isTripActive(trip));
	let upcoming = $derived(isTripUpcoming(trip));
	let past = $derived(isTripPast(trip));

	let sortedFlights = $derived(
		[...(trip.flights ?? [])].sort((a, b) => {
			if (a.direction === 'outbound' && b.direction === 'return') return -1;
			if (a.direction === 'return' && b.direction === 'outbound') return 1;
			return a.date.localeCompare(b.date);
		})
	);

	let uploading = $state(false);
	let fileInput: HTMLInputElement | undefined = $state();
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

	<!-- Travel info -->
	{#if sortedFlights.length > 0}
		<section class="space-y-3">
			<h2 class="font-display text-xl font-bold text-plum">
				Reisedetaljer
			</h2>
			{#each sortedFlights as flight (flight.id)}
				<FlightCard {flight} />
			{/each}
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

	<!-- Photos section (active or past trips only) -->
	{#if active || past}
		<section class="space-y-4">
			<h2 class="font-display text-xl font-bold text-plum">
				Bilder
			</h2>

			{#if trip.photos && trip.photos.length > 0}
				<ImageGrid photos={trip.photos} />
			{:else}
				<p class="text-plum/40 text-sm italic">Ingen bilder lagt til ennå.</p>
			{/if}

			<!-- Upload form -->
			<form
				method="POST"
				action="?/upload"
				enctype="multipart/form-data"
				use:enhance={() => {
					uploading = true;
					return async ({ update }) => {
						await update();
						uploading = false;
						if (fileInput) fileInput.value = '';
					};
				}}
			>
				<input
					bind:this={fileInput}
					type="file"
					name="photos"
					accept="image/*"
					multiple
					class="hidden"
					id="photo-upload"
					onchange={(e) => e.currentTarget.form?.requestSubmit()}
				/>

				<button
					type="button"
					disabled={uploading}
					onclick={() => fileInput?.click()}
					class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink/30 bg-white/50 px-5 py-4 text-sm font-semibold text-plum/60 transition-all hover:border-pink/50 hover:bg-white hover:text-plum active:scale-[0.98] disabled:opacity-50"
				>
					{#if uploading}
						<span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-pink border-t-transparent"></span>
						Laster opp...
					{:else}
						<span aria-hidden="true">📷</span>
						Legg til bilder
					{/if}
				</button>
			</form>

			{#if form?.error}
				<p class="text-center text-sm text-rose">{form.error}</p>
			{/if}
		</section>
	{/if}
</div>
