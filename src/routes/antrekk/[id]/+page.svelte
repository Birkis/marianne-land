<script lang="ts">
	import OutfitBuilder from '$lib/components/OutfitBuilder.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>{data.outfit.name} — Våre eventyr</title>
	<meta name="description" content="Rediger antrekk." />
</svelte:head>

<div class="space-y-8">
	<header class="pt-4 text-center">
		<h1 class="font-display text-3xl font-bold text-plum sm:text-4xl">{data.outfit.name}</h1>
		<p class="text-plum/50 mt-2 text-sm">Oppdater antrekket og lagre.</p>
	</header>

	<OutfitBuilder
		garments={data.garments}
		initialName={data.outfit.name}
		initialSelected={data.outfit.garments}
		formAction="?/update"
		submitLabel="Lagre endringer"
	/>

	<form method="POST" action="?/delete" class="pt-2">
		<button
			type="submit"
			class="w-full rounded-full border-2 border-rose/30 bg-white px-6 py-3 text-sm font-bold text-rose shadow-sm transition-all hover:border-rose/50 hover:bg-rose/5 active:scale-95"
		>
			Slett antrekk
		</button>
	</form>

	{#if form?.error}
		<p class="text-center text-sm text-rose">{form.error}</p>
	{/if}
</div>

