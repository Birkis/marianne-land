<script lang="ts">
	import OutfitCard from '$lib/components/OutfitCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Antrekk — Våre eventyr</title>
	<meta name="description" content="Planlegg antrekk." />
</svelte:head>

<div class="space-y-8">
	<header class="pt-4 text-center">
		<h1 class="font-display text-3xl font-bold text-plum sm:text-4xl">Antrekk</h1>
		<p class="text-plum/50 mt-2 text-sm">
			{#if data.outfits.length > 0}
				{data.outfits.length} {data.outfits.length === 1 ? 'antrekk' : 'antrekk'}
			{:else}
				Ingen antrekk laget ennå
			{/if}
		</p>
	</header>

	<div class="grid grid-cols-2 gap-3">
		<a
			href="/antrekk/ny"
			class="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink/30 bg-white/50 px-5 py-4 text-sm font-semibold text-plum/60 transition-all hover:border-pink/50 hover:bg-white hover:text-plum active:scale-[0.98]"
		>
			<span aria-hidden="true">+</span>
			Nytt antrekk
		</a>

		<a
			href="/antrekk/garderobe"
			class="inline-flex items-center justify-center rounded-2xl border-2 border-pink/20 bg-white px-5 py-4 text-sm font-semibold text-plum/60 shadow-sm transition-all hover:border-pink/40 hover:text-plum active:scale-[0.98]"
		>
			Garderobe
		</a>
	</div>

	{#if data.outfits.length > 0}
		<section>
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{#each data.outfits as outfit (outfit._id)}
					<OutfitCard {outfit} />
				{/each}
			</div>
		</section>
	{:else}
		<section class="rounded-3xl border-2 border-pink/20 bg-white p-8 text-center shadow-sm">
			<div class="mb-4 text-5xl">👗</div>
			<h2 class="font-display text-xl font-bold text-plum">Ingen antrekk enda</h2>
			<p class="text-plum/50 mt-2 text-sm">
				Start med å legge til plagg i garderoben, og lag deretter ditt første antrekk.
			</p>
			<div class="mt-4 flex gap-3">
				<a
					href="/antrekk/garderobe"
					class="flex-1 rounded-full bg-pink px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-pink-soft active:scale-95"
				>
					Legg til plagg
				</a>
				<a
					href="/antrekk/ny"
					class="flex-1 rounded-full border-2 border-pink/20 bg-white px-6 py-3 text-sm font-semibold text-plum/60 transition-all hover:border-pink/40 hover:text-plum active:scale-95"
				>
					Nytt antrekk
				</a>
			</div>
		</section>
	{/if}
</div>

