<script lang="ts">
	import { enhance } from '$app/forms';
	import BagCard from '$lib/components/BagCard.svelte';
	import { BAG_TAGS } from '$lib/data/bags';

	let { data, form } = $props();

	let showForm = $state(false);
	let submitting = $state(false);
	let fileInput: HTMLInputElement | undefined = $state();
	let previewUrl: string | undefined = $state();
	let addingNewBrand = $state(false);
	let selectedBrandId = $state('');

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
		addingNewBrand = false;
		selectedBrandId = '';
		if (fileInput) fileInput.value = '';
	}
</script>

<svelte:head>
	<title>Veskesamlingen — Våre eventyr</title>
	<meta name="description" content="Min veskesamling." />
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<header class="pt-4 text-center">
		<h1 class="font-display text-3xl font-bold text-plum sm:text-4xl">
			Veskesamlingen
		</h1>
		<p class="text-plum/50 mt-2 text-sm">
			{#if data.bags.length > 0}
				{data.bags.length} {data.bags.length === 1 ? 'veske' : 'vesker'}
			{:else}
				Ingen vesker lagt til ennå
			{/if}
		</p>
	</header>

	<!-- Add bag toggle -->
	{#if !showForm}
		<button
			onclick={() => (showForm = true)}
			class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink/30 bg-white/50 px-5 py-4 text-sm font-semibold text-plum/60 transition-all hover:border-pink/50 hover:bg-white hover:text-plum active:scale-[0.98]"
		>
			<span aria-hidden="true">+</span>
			Legg til veske
		</button>
	{/if}

	<!-- Add bag form -->
	{#if showForm}
		<section class="rounded-3xl border-2 border-pink/20 bg-white p-6 shadow-sm">
			<h2 class="font-display mb-4 text-lg font-bold text-plum">Ny veske</h2>

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
				<!-- Image upload -->
				<div>
					<label for="bag-image" class="text-plum/70 mb-1 block text-sm font-medium">
						Bilde *
					</label>
					{#if previewUrl}
						<div class="mb-2 aspect-square w-32 overflow-hidden rounded-2xl border-2 border-pink/20">
							<img src={previewUrl} alt="Forhåndsvisning" class="h-full w-full object-cover" />
						</div>
					{/if}
					<input
						bind:this={fileInput}
						type="file"
						name="image"
						id="bag-image"
						accept="image/*"
						onchange={handleImageChange}
						class="block w-full text-sm text-plum/60 file:mr-3 file:rounded-full file:border-0 file:bg-pink/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-plum hover:file:bg-pink/20"
					/>
				</div>

				<!-- Name -->
				<div>
					<label for="bag-name" class="text-plum/70 mb-1 block text-sm font-medium">
						Navn *
					</label>
					<input
						type="text"
						name="name"
						id="bag-name"
						placeholder="F.eks. Den svarte Celine"
						required
						class="w-full rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:border-pink focus:ring-0"
					/>
				</div>

				<!-- Brand -->
				<div>
					<label for="bag-brand" class="text-plum/70 mb-1 block text-sm font-medium">
						Merke
					</label>

					{#if !addingNewBrand}
						<div class="flex gap-2">
							<select
								name="brandId"
								id="bag-brand"
								bind:value={selectedBrandId}
								class="flex-1 rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum focus:border-pink focus:ring-0"
							>
								<option value="">Velg merke...</option>
								{#each data.brands as brand (brand._id)}
									<option value={brand._id}>{brand.name}</option>
								{/each}
							</select>
							<button
								type="button"
								onclick={() => (addingNewBrand = true)}
								class="shrink-0 rounded-xl border-2 border-dashed border-pink/30 px-3 py-2.5 text-sm font-semibold text-plum/50 transition-all hover:border-pink/50 hover:text-plum"
								title="Nytt merke"
							>
								+
							</button>
						</div>
					{:else}
						<div class="flex gap-2">
							<input
								type="text"
								name="newBrandName"
								placeholder="Nytt merke, f.eks. Celine"
								class="flex-1 rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:border-pink focus:ring-0"
							/>
							<button
								type="button"
								onclick={() => (addingNewBrand = false)}
								class="shrink-0 rounded-xl border-2 border-pink/20 px-3 py-2.5 text-xs font-semibold text-plum/50 transition-all hover:border-pink/40 hover:text-plum"
							>
								Avbryt
							</button>
						</div>
					{/if}
				</div>

				<!-- Color -->
				<div>
					<label for="bag-color" class="text-plum/70 mb-1 block text-sm font-medium">
						Farge
					</label>
					<input
						type="text"
						name="color"
						id="bag-color"
						placeholder="F.eks. Svart"
						class="w-full rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:border-pink focus:ring-0"
					/>
				</div>

				<!-- Tags -->
				<fieldset>
					<legend class="text-plum/70 mb-2 text-sm font-medium">Tagger</legend>
					<div class="flex flex-wrap gap-2">
						{#each BAG_TAGS as tag (tag.value)}
							<label
								class="cursor-pointer rounded-full border-2 border-pink/20 px-3 py-1 text-xs font-semibold text-plum/60 transition-all has-checked:border-pink has-checked:bg-pink/10 has-checked:text-plum hover:border-pink/40"
							>
								<input type="checkbox" name="tags" value={tag.value} class="sr-only" />
								{tag.label}
							</label>
						{/each}
					</div>
				</fieldset>

				<!-- Notes -->
				<div>
					<label for="bag-notes" class="text-plum/70 mb-1 block text-sm font-medium">
						Notater
					</label>
					<textarea
						name="notes"
						id="bag-notes"
						rows={2}
						placeholder="Personlige notater..."
						class="w-full rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:border-pink focus:ring-0"
					></textarea>
				</div>

				<!-- Actions -->
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

	<!-- Bag grid -->
	{#if data.bags.length > 0}
		<section>
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{#each data.bags as bag (bag._id)}
					<BagCard {bag} />
				{/each}
			</div>
		</section>
	{:else if !showForm}
		<section class="rounded-3xl border-2 border-pink/20 bg-white p-8 text-center shadow-sm">
			<div class="mb-4 text-5xl">👜</div>
			<h2 class="font-display text-xl font-bold text-plum">Samlingen er tom</h2>
			<p class="text-plum/50 mt-2 text-sm">Legg til din første veske for å komme i gang!</p>
		</section>
	{/if}
</div>
