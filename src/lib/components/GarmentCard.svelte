<script lang="ts">
	import type { Garment } from '$lib/data/outfits';
	import { GARMENT_ZONES } from '$lib/data/outfits';

	let { garment }: { garment: Garment } = $props();

	let zoneLabel = $derived(GARMENT_ZONES.find((z) => z.value === garment.zone)?.label ?? garment.zone);
</script>

<div
	class="group block overflow-hidden rounded-2xl border-2 border-pink/15 bg-white shadow-sm transition-all hover:border-pink hover:shadow-md"
>
	<div class="aspect-square overflow-hidden bg-blush-dark">
		<img
			src="{garment.imageUrl}?w=400&h=400&fit=crop&auto=format"
			alt={garment.name}
			loading="lazy"
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>
	</div>

	<div class="p-3">
		<h3 class="font-display truncate text-sm font-bold text-plum transition-colors group-hover:text-pink">
			{garment.name}
		</h3>
		<p class="text-plum/50 mt-0.5 truncate text-xs">{zoneLabel}</p>
	</div>
</div>

