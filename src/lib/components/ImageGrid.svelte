<script lang="ts">
	let { photos }: { photos: string[] } = $props();
</script>

{#if photos.length > 0}
	<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
		{#each photos as url, i (url)}
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				class="group relative aspect-square overflow-hidden rounded-2xl border-2 border-pink/10 bg-white shadow-sm transition-all hover:border-pink/30 hover:shadow-md"
			>
				<img
					src="{url}?w=400&h=400&fit=crop&auto=format"
					alt="Reisebilde {i + 1}"
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
			</a>
		{/each}
	</div>
{/if}
