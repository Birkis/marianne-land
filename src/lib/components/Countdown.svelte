<script lang="ts">
	import { onMount } from 'svelte';

	let { targetDate, destination = '', emoji = '' }: { targetDate: string; destination?: string; emoji?: string } = $props();

	let now = $state(Date.now());
	let mounted = $state(false);

	$effect(() => {
		const interval = setInterval(() => {
			now = Date.now();
		}, 1000);

		return () => clearInterval(interval);
	});

	onMount(() => {
		mounted = true;
	});

	let target = $derived(new Date(targetDate + 'T00:00:00').getTime());
	let diff = $derived(Math.max(0, target - now));
	let isComplete = $derived(diff <= 0);

	let days = $derived(Math.floor(diff / (1000 * 60 * 60 * 24)));
	let hours = $derived(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
	let minutes = $derived(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
	let seconds = $derived(Math.floor((diff % (1000 * 60)) / 1000));

	function pad(n: number): string {
		return String(n).padStart(2, '0');
	}
</script>

<div class="text-center">
	{#if !mounted}
		<div class="flex items-center justify-center py-12">
			<div class="text-plum/30 text-lg">Laster...</div>
		</div>
	{:else if isComplete}
		<div class="py-8">
			<div class="animate-float mb-4 text-6xl">{emoji || '✈️'}</div>
			<h2 class="font-display mb-2 text-3xl font-bold text-plum">
				Nå er det tid!
			</h2>
			<p class="text-plum/60 text-lg">
				{destination ? `${destination}-eventyret ditt venter` : 'Eventyret venter'} ✨
			</p>
		</div>
	{:else}
		<div class="py-6">
			<p class="text-plum/50 mb-1 text-sm font-medium uppercase tracking-widest">
				Nedtelling til
			</p>
			<h2 class="font-display mb-6 text-2xl font-bold text-plum">
				{emoji} {destination}
			</h2>

			<div class="grid grid-cols-4 gap-2 sm:gap-3">
				{@render timeUnit(pad(days), 'dager')}
				{@render timeUnit(pad(hours), 'timer')}
				{@render timeUnit(pad(minutes), 'min')}
				{@render timeUnit(pad(seconds), 'sek')}
			</div>
		</div>
	{/if}
</div>

{#snippet timeUnit(value: string, label: string)}
	<div class="flex flex-col items-center">
		<div
			class="flex w-full items-center justify-center rounded-xl bg-plum py-3 font-bold tabular-nums text-blush shadow-md sm:rounded-2xl sm:py-4"
		>
			<span class="text-2xl sm:text-4xl">{value}</span>
		</div>
		<span class="text-plum/40 mt-1.5 text-[10px] font-semibold uppercase tracking-wider sm:text-xs">
			{label}
		</span>
	</div>
{/snippet}
