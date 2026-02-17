<script lang="ts">
	import OutfitBuilder from '$lib/components/OutfitBuilder.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Nytt antrekk — Våre eventyr</title>
	<meta name="description" content="Lag et nytt antrekk." />
</svelte:head>

<div class="space-y-8">
	<header class="pt-4 text-center">
		<h1 class="font-display text-3xl font-bold text-plum sm:text-4xl">Nytt antrekk</h1>
		<p class="text-plum/50 mt-2 text-sm">Velg ett plagg per kategori.</p>
	</header>

	<OutfitBuilder garments={data.garments} formAction="?/save" submitLabel="Lagre antrekk" />

	{#if form?.error}
		<p class="text-center text-sm text-rose">{form.error}</p>
	{/if}
</div>

