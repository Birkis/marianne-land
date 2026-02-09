<script lang="ts">
	import type { Trip } from '$lib/data/trips';
	import { getTripDays, formatDate, isSurpriseUnlocked } from '$lib/data/trips';
	import SurpriseCard from './SurpriseCard.svelte';

	let { trip }: { trip: Trip } = $props();

	let days = $derived(getTripDays(trip));

	function isDayUnlocked(dateStr: string): boolean {
		const today = new Date();
		const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const [y, m, d] = dateStr.split('-').map(Number);
		const date = new Date(y, m - 1, d);
		return todayOnly >= date;
	}

	function isToday(dateStr: string): boolean {
		const today = new Date();
		const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
		return dateStr === todayStr;
	}
</script>

<div class="space-y-8">
	{#each days as day, i (day.date)}
		{@const unlocked = isDayUnlocked(day.date)}
		{@const today = isToday(day.date)}

		<div class="relative">
			<!-- Timeline connector -->
			{#if i < days.length - 1}
				<div
					class="absolute left-[15px] top-10 h-[calc(100%+2rem)] w-0.5
						{unlocked ? 'bg-pink' : 'bg-plum/10'}"
				></div>
			{/if}

			<!-- Day header -->
			<div class="flex items-center gap-3">
				<div
					class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold
						{today ? 'animate-pulse-glow bg-pink text-white' : unlocked ? 'bg-pink/80 text-white' : 'bg-plum/10 text-plum/40'}"
				>
					{i + 1}
				</div>
				<div>
					<h3 class="font-display text-base font-bold {unlocked ? 'text-plum' : 'text-plum/40'}">
						{formatDate(day.date)}
					</h3>
					{#if today}
						<p class="text-xs font-medium text-pink">I dag!</p>
					{/if}
				</div>
			</div>

			<!-- Surprise cards for this day -->
			{#if day.surprises.length > 0}
				<div class="mt-4 ml-11 space-y-3">
					{#each day.surprises as surprise (surprise.id)}
						<SurpriseCard
							{surprise}
							unlocked={isSurpriseUnlocked(surprise.unlockDate)}
						/>
					{/each}
				</div>
			{:else}
				<div class="mt-3 ml-11">
					<p class="text-plum/30 text-sm italic">
						{unlocked ? 'En dag for å utforske!' : 'Overraskelser kommer...'}
					</p>
				</div>
			{/if}
		</div>
	{/each}
</div>
