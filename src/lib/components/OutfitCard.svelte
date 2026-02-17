<script lang="ts">
	import type { Outfit, GarmentZone } from '$lib/data/outfits';
	import { GARMENT_ZONES } from '$lib/data/outfits';

	let { outfit }: { outfit: Outfit } = $props();

	const zones: GarmentZone[] = ['hodeplagg', 'overdel', 'underdel', 'sko', 'tilbehor'];

	function labelForZone(zone: GarmentZone) {
		return GARMENT_ZONES.find((z) => z.value === zone)?.label ?? zone;
	}
</script>

<a
	href="/antrekk/{outfit._id}"
	class="group block overflow-hidden rounded-2xl border-2 border-pink/15 bg-white shadow-sm transition-all hover:border-pink hover:shadow-md"
>
	<div class="p-3">
		<h3 class="font-display truncate text-sm font-bold text-plum transition-colors group-hover:text-pink">
			{outfit.name}
		</h3>

		<div class="mt-3 space-y-2">
			{#each zones as zone (zone)}
				{@const garment = outfit.resolvedGarments?.[zone]}
				<div class="flex items-center gap-2">
					<div class="h-9 w-9 overflow-hidden rounded-xl border-2 border-pink/10 bg-blush-dark">
						{#if garment}
							<img
								src="{garment.imageUrl}?w=120&h=120&fit=crop&auto=format"
								alt={garment.name}
								loading="lazy"
								class="h-full w-full object-cover"
							/>
						{/if}
					</div>
					<p class="min-w-0 flex-1 truncate text-xs text-plum/60">
						<span class="font-semibold">{labelForZone(zone)}:</span>
						{garment ? garment.name : '—'}
					</p>
				</div>
			{/each}
		</div>
	</div>
</a>

