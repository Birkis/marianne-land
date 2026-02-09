<script lang="ts">
	import type { Bag } from '$lib/data/bags';

	let { bag }: { bag: Bag } = $props();
</script>

<a
	href="/vesker/{bag._id}"
	class="group block overflow-hidden rounded-2xl border-2 border-pink/15 bg-white shadow-sm transition-all hover:border-pink hover:shadow-md"
>
	<div class="aspect-square overflow-hidden bg-blush-dark">
		<img
			src="{bag.imageUrl}?w=400&h=400&fit=crop&auto=format"
			alt={bag.name}
			loading="lazy"
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>
	</div>

	<div class="p-3">
		<h3 class="font-display truncate text-sm font-bold text-plum transition-colors group-hover:text-pink">
			{bag.name}
		</h3>
		{#if bag.brand}
			<p class="text-plum/50 mt-0.5 truncate text-xs">{bag.brand.name}</p>
		{/if}
	</div>
</a>
