<script lang="ts">
	import { enhance } from '$app/forms';
	import Countdown from '$lib/components/Countdown.svelte';
	import DayTimeline from '$lib/components/DayTimeline.svelte';
	import FlightCard from '$lib/components/FlightCard.svelte';
	import ImageGrid from '$lib/components/ImageGrid.svelte';
	import { isTripActive, isTripUpcoming, isTripPast, formatDateShort } from '$lib/data/trips';
	import type { Trip } from '$lib/data/trips';
	import type { Bag } from '$lib/data/bags';

	type Props = { data: { trip: Trip; allBags: Bag[] }; form?: { error?: string } | null };
	let { data, form }: Props = $props();

	let trip: Trip = $derived(data.trip);
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

	// Bag picker state
	let showBagPicker = $state(false);
	let addingBag = $state(false);
	let removingBagId: string | null = $state(null);
	let selectedBagId = $state('');

	let selectedBagIds = $derived(
		new Set(
			(trip.selectedBags ?? [])
				.map((b) => b._id)
				.filter((id): id is string => typeof id === 'string' && id.length > 0)
		)
	);
	let availableBags: Bag[] = $derived(
		data.allBags.filter((b) => b._id && !selectedBagIds.has(b._id))
	);
</script>

<svelte:head>
	<title>{trip.emoji} {trip.destination} — Våre eventyr</title>
	<meta
		name="description"
		content="{trip.tagline} — {formatDateShort(trip.departureDate)} til {formatDateShort(
			trip.returnDate
		)}"
	/>
</svelte:head>

<div class="space-y-8">
	<!-- Back link -->
	<nav>
		<a
			href="/"
			class="inline-flex items-center gap-1 text-sm text-plum/40 transition-colors hover:text-plum"
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
		<p class="mt-1 text-sm text-plum/50">{trip.tagline}</p>
		<p class="mt-2 text-xs text-plum/30">
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
			<p class="mt-1 text-sm text-plum/50">Nyt hvert øyeblikk</p>
		</section>
	{:else if past}
		<section class="rounded-3xl border-2 border-pink/20 bg-white p-6 text-center">
			<div class="mb-2 text-4xl">💕</div>
			<p class="font-display text-lg font-bold text-plum">For en tur!</p>
			<p class="mt-1 text-sm text-plum/50">Gjenopplev overraskelsene nedenfor</p>
		</section>
	{/if}

	<!-- Travel info -->
	{#if sortedFlights.length > 0}
		<section class="space-y-3">
			<h2 class="font-display text-xl font-bold text-plum">Reisedetaljer</h2>
			{#each sortedFlights as flight (flight.id)}
				<FlightCard {flight} />
			{/each}
		</section>
	{/if}

	<!-- Bag picker -->
	{#if upcoming || active}
		<section class="space-y-4">
			<h2 class="font-display text-xl font-bold text-plum">Hvilke vesker tar du med?</h2>

			<!-- Currently selected bags -->
			{#if trip.selectedBags && trip.selectedBags.length > 0}
				<div class="space-y-2">
					{#each trip.selectedBags as bag (bag._id)}
						<div
							class="flex items-center gap-3 rounded-2xl border-2 border-pink/20 bg-white p-3 shadow-sm"
						>
							<div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-blush-dark">
								<img
									src="{bag.imageUrl}?w=120&h=120&fit=crop&auto=format"
									alt={bag.name}
									class="h-full w-full object-cover"
								/>
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate font-display text-sm font-bold text-plum">{bag.name}</p>
								{#if bag.brand}
									<p class="truncate text-xs text-plum/50">{bag.brand.name}</p>
								{/if}
							</div>
							<form
								method="POST"
								action="?/removeBag"
								use:enhance={() => {
									removingBagId = bag._id ?? null;
									return async ({ update }) => {
										await update();
										removingBagId = null;
									};
								}}
							>
								<input type="hidden" name="bagId" value={bag._id} />
								<button
									type="submit"
									disabled={removingBagId === bag._id}
									class="rounded-full p-2 text-plum/30 transition-colors hover:bg-rose/10 hover:text-rose active:scale-90 disabled:opacity-50"
									title="Fjern veske"
								>
									{#if removingBagId === bag._id}
										<span
											class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-plum/30 border-t-transparent"
										></span>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clip-rule="evenodd"
											/>
										</svg>
									{/if}
								</button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-plum/40 italic">Ingen vesker valgt ennå.</p>
			{/if}

			<!-- Add bag -->
			{#if availableBags.length > 0}
				{#if !showBagPicker}
					<button
						onclick={() => (showBagPicker = true)}
						class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink/30 bg-white/50 px-5 py-3 text-sm font-semibold text-plum/60 transition-all hover:border-pink/50 hover:bg-white hover:text-plum active:scale-[0.98]"
					>
						<span aria-hidden="true">👜</span>
						Legg til veske
					</button>
				{:else}
					<form
						method="POST"
						action="?/addBag"
						use:enhance={() => {
							addingBag = true;
							return async ({ update }) => {
								await update();
								addingBag = false;
								selectedBagId = '';
								showBagPicker = false;
							};
						}}
						class="flex gap-2"
					>
						<select
							name="bagId"
							bind:value={selectedBagId}
							class="flex-1 rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum focus:border-pink focus:ring-0"
						>
							<option value="">Velg veske...</option>
							{#each availableBags as bag (bag._id)}
								<option value={bag._id}>
									{bag.name}{bag.brand ? ` — ${bag.brand.name}` : ''}
								</option>
							{/each}
						</select>
						<button
							type="submit"
							disabled={addingBag || !selectedBagId}
							class="shrink-0 rounded-xl bg-pink px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-pink-soft active:scale-95 disabled:opacity-50"
						>
							{#if addingBag}
								...
							{:else}
								Legg til
							{/if}
						</button>
						<button
							type="button"
							onclick={() => {
								showBagPicker = false;
								selectedBagId = '';
							}}
							class="shrink-0 rounded-xl border-2 border-pink/20 px-3 py-2.5 text-xs font-semibold text-plum/50 transition-all hover:border-pink/40 hover:text-plum"
						>
							Avbryt
						</button>
					</form>
				{/if}
			{:else if !trip.selectedBags || trip.selectedBags.length === 0}
				<p class="text-center text-xs text-plum/40">
					Ingen vesker i samlingen ennå.
					<a href="/vesker" class="font-semibold text-pink hover:underline">Legg til vesker</a>
				</p>
			{:else}
				<div class="rounded-2xl border-2 border-dashed border-pink/20 bg-white/40 p-4 text-center">
					<p class="text-sm text-plum/50">Du har allerede lagt til alle vesker i samlingen.</p>
					<a
						href="/vesker"
						class="mt-2 inline-flex items-center justify-center rounded-xl bg-pink px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-pink-soft active:scale-95"
					>
						Legg til flere vesker
					</a>
				</div>
			{/if}
		</section>
	{:else if past && trip.selectedBags && trip.selectedBags.length > 0}
		<section class="space-y-4">
			<h2 class="font-display text-xl font-bold text-plum">Vesker på turen</h2>
			<div class="space-y-2">
				{#each trip.selectedBags as bag (bag._id)}
					<a
						href="/vesker/{bag._id}"
						class="flex items-center gap-3 rounded-2xl border-2 border-pink/15 bg-white p-3 shadow-sm transition-all hover:border-pink hover:shadow-md"
					>
						<div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-blush-dark">
							<img
								src="{bag.imageUrl}?w=120&h=120&fit=crop&auto=format"
								alt={bag.name}
								class="h-full w-full object-cover"
							/>
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate font-display text-sm font-bold text-plum">{bag.name}</p>
							{#if bag.brand}
								<p class="truncate text-xs text-plum/50">{bag.brand.name}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Surprises timeline -->
	<section>
		<h2 class="mb-6 font-display text-xl font-bold text-plum">
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
			<h2 class="font-display text-xl font-bold text-plum">Bilder</h2>

			{#if trip.photos && trip.photos.length > 0}
				<ImageGrid photos={trip.photos} />
			{:else}
				<p class="text-sm text-plum/40 italic">Ingen bilder lagt til ennå.</p>
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
						<span
							class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-pink border-t-transparent"
						></span>
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
