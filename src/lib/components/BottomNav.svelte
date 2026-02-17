<script lang="ts">
	import { page } from '$app/stores';

	let pathname = $derived($page.url.pathname);

	const tabs = [
		{ href: '/', label: 'Eventyr', icon: '✈️', match: (p: string) => p === '/' || p.startsWith('/trip') },
		{ href: '/antrekk', label: 'Antrekk', icon: '👗', match: (p: string) => p.startsWith('/antrekk') },
		{ href: '/vesker', label: 'Vesker', icon: '👜', match: (p: string) => p.startsWith('/vesker') }
	] as const;
</script>

<nav class="fixed inset-x-0 bottom-0 z-50 border-t border-pink/10 bg-white/90 backdrop-blur-md">
	<div class="mx-auto flex max-w-lg">
		{#each tabs as tab (tab.href)}
			{@const active = tab.match(pathname)}
			<a
				href={tab.href}
				class="flex flex-1 flex-col items-center gap-0.5 py-2 text-center transition-colors
					{active ? 'text-pink' : 'text-plum/40 hover:text-plum/70'}"
			>
				<span class="text-xl">{tab.icon}</span>
				<span class="text-[10px] font-semibold uppercase tracking-wider">{tab.label}</span>
			</a>
		{/each}
	</div>
</nav>
