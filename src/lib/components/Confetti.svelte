<script lang="ts">
	let { active = false }: { active?: boolean } = $props();

	let pieces: { id: number; x: number; color: string; delay: number; size: number }[] = $state([]);

	$effect(() => {
		if (active) {
			const colors = ['#ec4899', '#f9a8d4', '#fbcfe8', '#e11d48', '#881337', '#fdf2f8'];
			pieces = Array.from({ length: 24 }, (_, i) => ({
				id: i,
				x: Math.random() * 100,
				color: colors[Math.floor(Math.random() * colors.length)],
				delay: Math.random() * 0.3,
				size: 4 + Math.random() * 6
			}));

			setTimeout(() => {
				pieces = [];
			}, 1500);
		}
	});
</script>

{#if pieces.length > 0}
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		{#each pieces as piece (piece.id)}
			<div
				class="confetti-piece absolute rounded-sm"
				style:left="{piece.x}%"
				style:top="0"
				style:width="{piece.size}px"
				style:height="{piece.size}px"
				style:background-color={piece.color}
				style:animation-delay="{piece.delay}s"
			></div>
		{/each}
	</div>
{/if}
