<script lang="ts">
	import './layout.css';
	import BottomNav from '$lib/components/BottomNav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#881337" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<link rel="icon" type="image/jpeg" href="/marianneland-icon_leather.jpg" />
	<link rel="apple-touch-icon" href="/marianneland-icon_leather.jpg" />
</svelte:head>

<div class="flex min-h-dvh flex-col bg-blush">
	<main class="mx-auto w-full max-w-lg flex-1 px-4 pb-24 pt-6">
		{@render children()}
	</main>

	<footer class="pb-20 pt-4 text-center text-xs text-plum/30">
		Laget med <span class="text-pink">&#9829;</span>
	</footer>

	<BottomNav />
</div>
