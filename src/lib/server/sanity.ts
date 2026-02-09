import { createClient } from '@sanity/client';
import {
	SANITY_PROJECT_ID,
	SANITY_DATASET,
	SANITY_API_VERSION,
	SANITY_TOKEN
} from '$env/static/private';

export const sanityClient = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: SANITY_API_VERSION || '2024-01-01',
	useCdn: true,
	token: SANITY_TOKEN || undefined
});

/** Write client with useCdn: false, required for mutations (asset uploads, document patches). */
export const sanityWriteClient = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: SANITY_API_VERSION || '2024-01-01',
	useCdn: false,
	token: SANITY_TOKEN
});
