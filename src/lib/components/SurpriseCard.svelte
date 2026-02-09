<script lang="ts">
	import type { Surprise } from '$lib/data/trips';
	import { formatDate } from '$lib/data/trips';
	import Confetti from './Confetti.svelte';

	let {
		surprise,
		unlocked = false
	}: {
		surprise: Surprise;
		unlocked?: boolean;
	} = $props();

	let revealed = $state(false);
	let showConfetti = $state(false);
	let shaking = $state(false);

	function handleTap() {
		if (!unlocked) {
			shaking = true;
			setTimeout(() => {
				shaking = false;
			}, 300);
			return;
		}

		if (revealed) return;

		revealed = true;
		showConfetti = true;

		// Haptic feedback
		if (navigator.vibrate) {
			navigator.vibrate(50);
		}

		setTimeout(() => {
			showConfetti = false;
		}, 1500);
	}
</script>

<button
	class="perspective relative w-full"
	onclick={handleTap}
	aria-label={unlocked ? `Avslør overraskelse: ${surprise.title}` : `Låst til ${formatDate(surprise.unlockDate)}`}
>
	<div class="flip-card-inner relative h-48 w-full {revealed ? 'flipped' : ''}">
		<!-- Front of card -->
		<div
			class="flip-card-front absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 p-4
				{unlocked
					? 'cursor-pointer border-pink bg-white shadow-lg transition-shadow hover:shadow-xl'
					: 'border-plum/10 bg-plum/5'}
				{shaking ? 'animate-shake' : ''}"
		>
			{#if unlocked}
				<div class="mb-3 text-4xl">{surprise.icon}</div>
				<p class="font-display text-lg font-semibold text-plum">Trykk for å avsløre</p>
				<p class="text-plum/40 mt-1 text-xs">{surprise.type}</p>
			{:else}
				<div class="mb-3 text-3xl opacity-40">🔒</div>
				<p class="text-plum/40 text-sm font-medium">
					Åpnes {formatDate(surprise.unlockDate)}
				</p>
			{/if}
		</div>

		<!-- Back of card (revealed) -->
		<div
			class="flip-card-back absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-pink bg-white p-6 shadow-lg"
		>
			<div class="mb-3 text-4xl">{surprise.icon}</div>
			<h3 class="font-display mb-2 text-xl font-bold text-plum">{surprise.title}</h3>
			<p class="text-plum/70 text-center text-sm leading-relaxed">{surprise.description}</p>
		</div>
	</div>

	<Confetti active={showConfetti} />
</button>
