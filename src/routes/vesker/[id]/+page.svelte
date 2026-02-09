<script lang="ts">
	import { enhance } from '$app/forms';
	import { BAG_TAGS } from '$lib/data/bags';

	let { data } = $props();
	let bag = $derived(data.bag);

	let confirmingDelete = $state(false);
	let deleting = $state(false);

	function tagLabel(value: string): string {
		return BAG_TAGS.find((t) => t.value === value)?.label ?? value;
	}
</script>

<svelte:head>
	<title>{bag.name} — Veskesamlingen</title>
</svelte:head>

<div class="space-y-6">
	<!-- Back link -->
	<nav>
		<a
			href="/vesker"
			class="text-plum/40 hover:text-plum inline-flex items-center gap-1 text-sm transition-colors"
		>
			<span aria-hidden="true">&larr;</span>
			Tilbake til samlingen
		</a>
	</nav>

	<!-- Bag photo -->
	<div class="overflow-hidden rounded-3xl border-2 border-pink/20 bg-white shadow-sm">
		<img
			src="{bag.imageUrl}?w=800&h=800&fit=crop&auto=format"
			alt={bag.name}
			class="aspect-square w-full object-cover"
		/>
	</div>

	<!-- Bag info -->
	<div class="space-y-4">
		<div class="text-center">
			<h1 class="font-display text-2xl font-bold text-plum sm:text-3xl">
				{bag.name}
			</h1>
			{#if bag.brand}
				<p class="text-plum/50 mt-1 text-sm">{bag.brand.name}</p>
			{/if}
		</div>

		{#if bag.color}
			<div class="flex items-center justify-center gap-2">
				<span class="text-plum/40 text-xs font-medium uppercase tracking-wider">Farge</span>
				<span class="text-sm font-semibold text-plum">{bag.color}</span>
			</div>
		{/if}

		{#if bag.tags && bag.tags.length > 0}
			<div class="flex flex-wrap justify-center gap-2">
				{#each bag.tags as tag (tag)}
					<span class="rounded-full border-2 border-pink/20 bg-pink/10 px-3 py-1 text-xs font-semibold text-plum">
						{tagLabel(tag)}
					</span>
				{/each}
			</div>
		{/if}

		{#if bag.notes}
			<div class="rounded-2xl border-2 border-pink/10 bg-blush-dark p-4">
				<p class="text-plum/70 text-sm leading-relaxed">{bag.notes}</p>
			</div>
		{/if}
	</div>

	<!-- Delete -->
	<div class="pt-4">
		{#if !confirmingDelete}
			<button
				onclick={() => (confirmingDelete = true)}
				class="w-full rounded-full border-2 border-rose/20 px-6 py-3 text-sm font-semibold text-rose/60 transition-all hover:border-rose/40 hover:text-rose active:scale-95"
			>
				Slett veske
			</button>
		{:else}
			<div class="rounded-2xl border-2 border-rose/20 bg-rose/5 p-4 text-center">
				<p class="mb-3 text-sm font-medium text-plum">Er du sikker?</p>
				<div class="flex gap-3">
					<form
						method="POST"
						action="?/delete"
						use:enhance={() => {
							deleting = true;
							return async ({ update }) => {
								await update();
								deleting = false;
							};
						}}
						class="flex-1"
					>
						<button
							type="submit"
							disabled={deleting}
							class="w-full rounded-full bg-rose px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-rose/80 active:scale-95 disabled:opacity-50"
						>
							{#if deleting}
								Sletter...
							{:else}
								Ja, slett
							{/if}
						</button>
					</form>
					<button
						onclick={() => (confirmingDelete = false)}
						class="flex-1 rounded-full border-2 border-pink/20 px-6 py-2.5 text-sm font-semibold text-plum/60 transition-all hover:border-pink/40 hover:text-plum active:scale-95"
					>
						Avbryt
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
