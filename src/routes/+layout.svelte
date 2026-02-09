<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#881337" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<link rel="icon" type="image/png" href="/marianneland-icon.png" />
	<link rel="apple-touch-icon" href="/marianneland-icon.png" />
</svelte:head>

<div class="flex min-h-dvh flex-col bg-blush">
	<main class="mx-auto w-full max-w-lg flex-1 px-4 py-6">
		{@render children()}
	</main>

	<footer class="py-4 text-center text-xs text-plum/30">
		Laget med <span class="text-pink">&#9829;</span>
	</footer>
</div>
