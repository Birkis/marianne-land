<script lang="ts">
	import GarmentPicker from '$lib/components/GarmentPicker.svelte';
	import type { Garment, GarmentZone, OutfitGarments } from '$lib/data/outfits';
	import { GARMENT_ZONES } from '$lib/data/outfits';

	let {
		garments,
		initialName,
		initialSelected,
		formAction,
		submitLabel
	}: {
		garments: Garment[];
		initialName?: string;
		initialSelected?: Partial<OutfitGarments>;
		formAction: string;
		submitLabel: string;
	} = $props();

	const zones: GarmentZone[] = ['hodeplagg', 'overdel', 'underdel', 'sko', 'tilbehor'];

	type ZoneLayout = {
		top: number;
		left: number;
		width: number;
		height: number;
		zIndex: number;
		hotspotTop?: number;
		hotspotLeft?: number;
	};

	// Percent-based layout tuned for `static/marianne_outfit_base.png` (9:16).
	const zoneLayout: Record<GarmentZone, ZoneLayout> = {
		hodeplagg: { top: 2, left: 22, width: 56, height: 22, zIndex: 40, hotspotTop: 6, hotspotLeft: 74 },
		overdel: { top: 18, left: 18, width: 64, height: 30, zIndex: 30, hotspotTop: 22, hotspotLeft: 80 },
		underdel: { top: 44, left: 18, width: 64, height: 30, zIndex: 20, hotspotTop: 50, hotspotLeft: 80 },
		sko: { top: 80, left: 18, width: 64, height: 18, zIndex: 10, hotspotTop: 84, hotspotLeft: 70 },
		tilbehor: { top: 14, left: 4, width: 20, height: 70, zIndex: 50, hotspotTop: 18, hotspotLeft: 12 }
	};

	function initialFromProps() {
		return {
			name: initialName ?? '',
			selected: {
				hodeplagg: initialSelected?.hodeplagg,
				overdel: initialSelected?.overdel,
				underdel: initialSelected?.underdel,
				sko: initialSelected?.sko,
				tilbehor: initialSelected?.tilbehor
			} satisfies OutfitGarments
		};
	}

	const initial = initialFromProps();

	let name = $state(initial.name);
	let selected = $state<OutfitGarments>(initial.selected);

	let pickerOpen = $state(false);
	let activeZone = $state<GarmentZone>('overdel');

	function openPicker(zone: GarmentZone) {
		activeZone = zone;
		pickerOpen = true;
	}

	function closePicker() {
		pickerOpen = false;
	}

	function selectGarment(id: string) {
		selected[activeZone] = id;
		closePicker();
	}

	function clearZone(zone: GarmentZone) {
		selected[zone] = undefined;
	}

	function garmentById(id: string | undefined) {
		if (!id) return undefined;
		return garments.find((g) => g._id === id);
	}

	function garmentImageForLayer(garment: Garment) {
		return garment.overlayUrl || garment.imageUrl;
	}
</script>

<form method="POST" action={formAction} class="space-y-6">
	<section class="rounded-3xl border-2 border-pink/20 bg-white p-6 shadow-sm">
		<label for="outfit-name" class="text-plum/70 mb-1 block text-sm font-medium">Navn *</label>
		<input
			id="outfit-name"
			name="name"
			type="text"
			required
			bind:value={name}
			placeholder="F.eks. Middag i byen"
			class="w-full rounded-xl border-2 border-pink/20 bg-blush px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:border-pink focus:ring-0"
		/>
	</section>

	<section class="rounded-3xl border-2 border-pink/20 bg-white p-4 shadow-sm">
		<h2 class="text-plum/50 mb-3 text-xs font-semibold uppercase tracking-wider">Figur</h2>

		<div class="mx-auto w-full max-w-[340px]">
			<div class="relative w-full overflow-hidden rounded-3xl bg-blush" style="aspect-ratio: 9 / 16;">
				<img
					src="/marianne_outfit_base.png"
					alt="Figur"
					class="absolute inset-0 h-full w-full object-contain"
				/>

				{#each zones as zone (zone)}
					{@const layout = zoneLayout[zone]}
					{@const chosen = garmentById(selected[zone])}

					{#if chosen}
						<img
							src="{garmentImageForLayer(chosen)}?auto=format"
							alt={chosen.name}
							class="absolute object-contain pointer-events-none"
							style="
								top: {layout.top}%;
								left: {layout.left}%;
								width: {layout.width}%;
								height: {layout.height}%;
								z-index: {layout.zIndex};
							"
						/>
					{/if}

					<button
						type="button"
						class="absolute z-60 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-pink/30 bg-white/90 text-sm font-bold text-plum shadow-sm transition-all hover:border-pink/50 hover:bg-white active:scale-95"
						style="
							top: {(layout.hotspotTop ?? layout.top)}%;
							left: {(layout.hotspotLeft ?? layout.left)}%;
							transform: translate(-50%, -50%);
						"
						aria-label="{chosen ? 'Bytt' : 'Velg'} {zone}"
						onclick={() => openPicker(zone)}
					>
						{chosen ? '✎' : '+'}
					</button>
				{/each}
			</div>
		</div>
	</section>

	<section class="space-y-3">
		{#each zones as zone (zone)}
			{@const zoneMeta = GARMENT_ZONES.find((z) => z.value === zone)}
			{@const label = zoneMeta?.label ?? zone}
			{@const chosen = garmentById(selected[zone])}

			<div class="rounded-3xl border-2 border-pink/20 bg-white p-4 shadow-sm">
				<div class="flex items-center justify-between gap-3">
					<div>
						<p class="text-plum/50 text-xs font-semibold uppercase tracking-wider">{label}</p>
						{#if chosen}
							<p class="font-display mt-0.5 truncate text-base font-bold text-plum">{chosen.name}</p>
						{:else}
							<p class="mt-0.5 text-sm font-semibold text-plum/50">Ikke valgt</p>
						{/if}
					</div>

					<div class="flex items-center gap-2">
						{#if chosen}
							<button
								type="button"
								class="rounded-full border-2 border-pink/20 px-3 py-2 text-xs font-semibold text-plum/60 transition-all hover:border-pink/40 hover:text-plum active:scale-95"
								onclick={() => clearZone(zone)}
							>
								Fjern
							</button>
						{/if}
						<button
							type="button"
							class="rounded-full bg-pink px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-pink-soft active:scale-95"
							onclick={() => openPicker(zone)}
						>
							{chosen ? 'Bytt' : '+'}
						</button>
					</div>
				</div>

				{#if chosen}
					<div class="mt-3 flex items-center gap-3">
						<div class="h-16 w-16 overflow-hidden rounded-2xl border-2 border-pink/15 bg-blush-dark">
							<img
								src="{chosen.imageUrl}?w=200&h=200&fit=crop&auto=format"
								alt={chosen.name}
								loading="lazy"
								class="h-full w-full object-cover"
							/>
						</div>
						<p class="text-plum/50 text-xs">
							Trykk Bytt for å velge et annet plagg.
						</p>
					</div>
				{/if}
			</div>

			<input type="hidden" name="{zone}Id" value={selected[zone] ?? ''} />
		{/each}
	</section>

	<button
		type="submit"
		class="w-full rounded-full bg-pink px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-pink-soft hover:shadow-lg active:scale-95"
	>
		{submitLabel}
	</button>
</form>

<GarmentPicker
	open={pickerOpen}
	zone={activeZone}
	{garments}
	onSelect={selectGarment}
	onClose={closePicker}
/>

