<script lang="ts">
	import { enhance } from '$app/forms';
	import GarmentCard from '$lib/components/GarmentCard.svelte';
	import { GARMENT_ZONES, GARMENT_TAGS } from '$lib/data/outfits';

	let { data, form } = $props();

	let showForm = $state(false);
	let submitting = $state(false);
	let fileInputKey = $state(0);
	let previewUrl: string | undefined = $state();

	function handleImageChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			previewUrl = URL.createObjectURL(file);
		} else {
			previewUrl = undefined;
		}
	}

	function resetForm() {
		showForm = false;
		previewUrl = undefined;
		fileInputKey += 1;
	}
</script>

<svelte:head>
	<title>Garderoben — Våre eventyr</title>
	<meta name="description" content="Min garderobe." />
</svelte:head>

<div class="space-y-8">
	<header class="pt-4 text-center">
		<h1 class="font-display text-3xl font-bold text-plum sm:text-4xl">Garderoben</h1>
		<p class="text-plum/50 mt-2 text-sm">
			{#if data.garments.length > 0}
				{data.garments.length} {data.garments.length === 1 ? 'plagg' : 'plagg'}
			{:else}
				Ingen plagg lagt til ennå
			{/if}
		</p>
	</header>

	{#if !showForm}
		<button
			onclick={() => (showForm = true)}
			class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink/30 bg-white/50 px-5 py-4 text-sm font-semibold text-plum/60 transition-all hover:border-pink/50 hover:bg-white hover:text-plum active:scale-[0.98]"
		>
			<span aria-hidden="true">+</span>
			Legg til plagg
		</button>
	{/if}

	{#if showForm}
		<section class="rounded-3xl border-2 border-pink/20 bg-white p-6 shadow-sm">
			<h2 class="font-display mb-4 text-lg font-bold text-plum">Nytt plagg</h2>

			<form
				method="POST"
				action="?/add"
				enctype="multipart/form-data"
				use:enhance={() => {
					submitting = true;
					return async ({ update, result }) => {
						await update();
						submitting = false;
						if (result.type === 'success') {
							resetForm();
						}
					};
				}}
				class="space-y-4"
			>
				<div>
					<label for="garment-image" class="text-plum/70 mb-1 block text-sm font-medium">Bilde *</label>
					{#if previewUrl}
						<div class="mb-2 aspect-square w-32 overflow-hidden rounded-2xl border-2 border-pink/20">
							<img src={previewUrl} alt="Forhåndsvisning" class="h-full w-full object-cover" />
						</div>
					{/if}
					{#key fileInputKey}
						<input
							type="file"
							name="image"
							id="garment-image"
							accept="image/*"
							onchange={handleImageChange}
							class="block w-full text-sm text-plum/60 file:mr-3 file:rounded-full file:border-0 file:bg-pink/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-plum hover:file:bg-pink/20"
						/>
					{/key}
				</div>

				<div>
					<label for="garment-overlay" class="text-plum/70 mb-1 block text-sm font-medium">
						Overlay (PNG, valgfri)
					</label>
					<p class="text-plum/50 mb-2 text-xs">
						Last opp en PNG med transparent bakgrunn for best resultat på figuren.
					</p>
					{#key fileInputKey}
						<input
							type="file"
							name="overlay"
							id="garment-overlay"
							accept="image/png"
							class="block w-full text-sm text-plum/60 file:mr-3 file:rounded-full file:border-0 file:bg-pink/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-plum hover:file:bg-pink/20"
						/>
					{/key}
				</div>

				<div>
					<label for="garment-name" class="text-plum/70 mb-1 block text-sm font-medium">Navn *</label>
					<input
						type="text"
						name="name"
						id="garment-name"
						placeholder="F.eks. Svart genser"
						required
						class="w-full rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:border-pink focus:ring-0"
					/>
				</div>

				<div>
					<label for="garment-zone" class="text-plum/70 mb-1 block text-sm font-medium">Kategori *</label>
					<select
						name="zone"
						id="garment-zone"
						required
						class="w-full rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum focus:border-pink focus:ring-0"
					>
						<option value="">Velg kategori...</option>
						{#each GARMENT_ZONES as zone (zone.value)}
							<option value={zone.value}>{zone.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="garment-color" class="text-plum/70 mb-1 block text-sm font-medium">Farge</label>
					<input
						type="text"
						name="color"
						id="garment-color"
						placeholder="F.eks. Svart"
						class="w-full rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:border-pink focus:ring-0"
					/>
				</div>

				<fieldset>
					<legend class="text-plum/70 mb-2 text-sm font-medium">Tagger</legend>
					<div class="flex flex-wrap gap-2">
						{#each GARMENT_TAGS as tag (tag.value)}
							<label
								class="cursor-pointer rounded-full border-2 border-pink/20 px-3 py-1 text-xs font-semibold text-plum/60 transition-all has-checked:border-pink has-checked:bg-pink/10 has-checked:text-plum hover:border-pink/40"
							>
								<input type="checkbox" name="tags" value={tag.value} class="sr-only" />
								{tag.label}
							</label>
						{/each}
					</div>
				</fieldset>

				<div>
					<label for="garment-notes" class="text-plum/70 mb-1 block text-sm font-medium">Notater</label>
					<textarea
						name="notes"
						id="garment-notes"
						rows={2}
						placeholder="Personlige notater..."
						class="w-full rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:border-pink focus:ring-0"
					></textarea>
				</div>

				<div class="flex gap-3 pt-2">
					<button
						type="submit"
						disabled={submitting}
						class="flex-1 rounded-full bg-pink px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-pink-soft hover:shadow-lg active:scale-95 disabled:opacity-50"
					>
						{#if submitting}
							<span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
							Lagrer...
						{:else}
							Legg til
						{/if}
					</button>
					<button
						type="button"
						onclick={resetForm}
						class="rounded-full border-2 border-pink/20 px-6 py-3 text-sm font-semibold text-plum/60 transition-all hover:border-pink/40 hover:text-plum active:scale-95"
					>
						Avbryt
					</button>
				</div>
			</form>

			{#if form?.error}
				<p class="mt-3 text-center text-sm text-rose">{form.error}</p>
			{/if}
		</section>
	{/if}

	{#if data.garments.length > 0}
		<section>
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{#each data.garments as garment (garment._id)}
					<GarmentCard {garment} />
				{/each}
			</div>
		</section>
	{:else if !showForm}
		<section class="rounded-3xl border-2 border-pink/20 bg-white p-8 text-center shadow-sm">
			<div class="mb-4 text-5xl">👗</div>
			<h2 class="font-display text-xl font-bold text-plum">Garderoben er tom</h2>
			<p class="text-plum/50 mt-2 text-sm">Legg til ditt første plagg for å komme i gang!</p>
		</section>
	{/if}
</div>

