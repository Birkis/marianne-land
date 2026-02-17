import { createClient } from '@sanity/client';
import { env } from '$env/dynamic/private';

// Using dynamic env keeps typechecking working even when no local `.env` exists.
// Important: @sanity/client throws if projectId is missing, so only create clients when configured.
const SANITY_PROJECT_ID = env.SANITY_PROJECT_ID;
const SANITY_DATASET = env.SANITY_DATASET;
const SANITY_API_VERSION = env.SANITY_API_VERSION ?? '2024-01-01';
const SANITY_TOKEN = env.SANITY_TOKEN;

const hasSanityConfig = !!SANITY_PROJECT_ID && !!SANITY_DATASET;

export const sanityClient = hasSanityConfig
	? createClient({
			projectId: SANITY_PROJECT_ID,
			dataset: SANITY_DATASET,
			apiVersion: SANITY_API_VERSION,
			useCdn: true,
			token: SANITY_TOKEN || undefined
		})
	: null;

/** Write client with useCdn: false, required for mutations (asset uploads, document patches). */
export const sanityWriteClient = hasSanityConfig
	? createClient({
			projectId: SANITY_PROJECT_ID,
			dataset: SANITY_DATASET,
			apiVersion: SANITY_API_VERSION,
			useCdn: false,
			token: SANITY_TOKEN
		})
	: null;

export function isSanityConfigured(): boolean {
	return hasSanityConfig;
}
