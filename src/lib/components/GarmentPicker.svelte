<script lang="ts">
	import type { Garment, GarmentZone } from '$lib/data/outfits';
	import { GARMENT_ZONES } from '$lib/data/outfits';

	let {
		open,
		zone,
		garments,
		onSelect,
		onClose
	}: {
		open: boolean;
		zone: GarmentZone;
		garments: Garment[];
		onSelect: (garmentId: string) => void;
		onClose: () => void;
	} = $props();

	let zoneLabel = $derived(GARMENT_ZONES.find((z) => z.value === zone)?.label ?? zone);
	let filtered = $derived(garments.filter((g) => g.zone === zone));
</script>

{#if open}
	<div class="fixed inset-0 z-60">
		<button
			type="button"
			class="absolute inset-0 bg-black/30"
			aria-label="Lukk"
			onclick={onClose}
		></button>

		<section
			class="absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg rounded-t-3xl border-2 border-pink/20 bg-white p-5 shadow-2xl"
			aria-label="Velg plagg"
		>
			<div class="flex items-center justify-between gap-3">
				<div>
					<h2 class="font-display text-lg font-bold text-plum">Velg plagg</h2>
					<p class="text-plum/50 text-xs">{zoneLabel}</p>
				</div>
				<button
					type="button"
					class="rounded-full border-2 border-pink/20 px-4 py-2 text-sm font-semibold text-plum/60 transition-all hover:border-pink/40 hover:text-plum active:scale-95"
					onclick={onClose}
				>
					Lukk
				</button>
			</div>

			<div class="mt-4">
				{#if filtered.length === 0}
					<div class="rounded-2xl border-2 border-dashed border-pink/20 bg-blush p-5 text-center">
						<p class="text-plum/60 text-sm">Ingen plagg i denne kategorien enda.</p>
						<a
							href="/antrekk/garderobe"
							class="mt-3 inline-flex items-center justify-center rounded-full bg-pink px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-pink-soft active:scale-95"
						>
							Legg til i garderoben
						</a>
					</div>
				{:else}
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{#each filtered as garment (garment._id)}
							<button
								type="button"
								class="group overflow-hidden rounded-2xl border-2 border-pink/15 bg-white text-left shadow-sm transition-all hover:border-pink hover:shadow-md active:scale-[0.99]"
								onclick={() => onSelect(garment._id)}
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
									<p class="font-display truncate text-sm font-bold text-plum group-hover:text-pink">
										{garment.name}
									</p>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	</div>
{/if}

