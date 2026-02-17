<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	const THRESHOLD_PX = 80;
	const MAX_PULL_PX = 160;
	const INDICATOR_MAX_TRANSLATE_PX = 72;

	let pullDistance = $state(0);
	let isRefreshing = $state(false);
	let isTracking = $state(false);

	let startX = 0;
	let startY = 0;
	let activeTouchId: number | null = null;

	function getScrollTop(): number {
		// SvelteKit pages scroll on the document/window by default.
		return document.scrollingElement?.scrollTop ?? window.scrollY ?? 0;
	}

	function rubberBand(distancePx: number): number {
		// Simple diminishing-returns curve past the base distance.
		const base = 120;
		if (distancePx <= base) return distancePx;
		return base + (distancePx - base) * 0.25;
	}

	async function refresh() {
		if (isRefreshing) return;
		isRefreshing = true;
		pullDistance = THRESHOLD_PX;

		try {
			await invalidateAll();
		} finally {
			isRefreshing = false;
			pullDistance = 0;
		}
	}

	function onTouchStart(e: TouchEvent) {
		if (isRefreshing) return;
		if (getScrollTop() > 0) return;
		if (e.touches.length !== 1) return;

		const t = e.touches[0];
		activeTouchId = t.identifier;
		startX = t.clientX;
		startY = t.clientY;
		isTracking = true;
		pullDistance = 0;
	}

	function onTouchMove(e: TouchEvent) {
		if (!isTracking || activeTouchId === null) return;

		const t = Array.from(e.touches).find((touch) => touch.identifier === activeTouchId);
		if (!t) return;

		const dy = t.clientY - startY;
		const dx = t.clientX - startX;

		// Ignore horizontal swipes / carousel gestures.
		if (Math.abs(dx) > Math.abs(dy)) return;

		// Only engage when pulling down from the very top.
		if (dy <= 0 || getScrollTop() > 0) {
			pullDistance = 0;
			return;
		}

		pullDistance = Math.min(MAX_PULL_PX, rubberBand(dy));

		// Prevent native overscroll/bounce while actively pulling.
		e.preventDefault();
	}

	function endGesture(touches: TouchList) {
		// If the tracked touch is still present, don't end yet.
		if (
			activeTouchId !== null &&
			Array.from(touches).some((touch) => touch.identifier === activeTouchId)
		) {
			return;
		}

		isTracking = false;
		activeTouchId = null;

		if (isRefreshing) return;

		if (pullDistance >= THRESHOLD_PX) {
			void refresh();
		} else {
			pullDistance = 0;
		}
	}

	function onTouchEnd(e: TouchEvent) {
		if (!isTracking) return;
		endGesture(e.touches);
	}

	function onTouchCancel(e: TouchEvent) {
		if (!isTracking) return;
		endGesture(e.touches);
	}

	let isVisible = $derived(isRefreshing || pullDistance > 0);
	let isReady = $derived(pullDistance >= THRESHOLD_PX);
	let progress = $derived(Math.min(1, pullDistance / THRESHOLD_PX));

	let indicatorTranslate = $derived.by(() => {
		const d = isRefreshing ? THRESHOLD_PX : pullDistance;
		return Math.min(INDICATOR_MAX_TRANSLATE_PX, d);
	});

	let arrowRotateDeg = $derived.by(() => {
		// Rotate the arrow as you approach the threshold; snap at the end.
		return Math.round((isReady ? 180 : progress * 180) * 10) / 10;
	});

	let indicatorTransition = $derived.by(() => {
		// Disable transitions while tracking the finger; re-enable on release.
		return isTracking && !isRefreshing ? 'none' : 'transform 180ms ease, opacity 180ms ease';
	});

	let arrowTransition = $derived.by(() => {
		return isTracking ? 'none' : 'transform 180ms ease';
	});
</script>

<svelte:window
	on:touchstart={onTouchStart}
	on:touchmove={onTouchMove}
	on:touchend={onTouchEnd}
	on:touchcancel={onTouchCancel}
/>

<!--
  Fixed, non-interactive indicator. The gesture is global (window scroll),
  so we don't need to wrap page content in a special scroll container.
-->
<div
	aria-hidden="true"
	class="pointer-events-none fixed top-2 left-1/2 z-50"
	style:transform="translate(-50%, {indicatorTranslate}px)"
	style:transition={indicatorTransition}
	style:opacity={isVisible ? 1 : 0}
>
	<div
		class="grid h-10 w-10 place-items-center rounded-full border border-pink/20 bg-white shadow-sm"
	>
		{#if isRefreshing}
			<div class="h-5 w-5 animate-spin rounded-full border-2 border-pink/20 border-t-pink"></div>
		{:else}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-5 w-5 text-plum"
				style:transform="rotate({arrowRotateDeg}deg)"
				style:transition={arrowTransition}
			>
				<path d="M12 5v12" />
				<path d="m7 12 5 5 5-5" />
			</svg>
		{/if}
	</div>
</div>
