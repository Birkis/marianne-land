import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
	name: 'marianne-land',
	title: 'Marianne Land',
	projectId: '2e73iv0w',
	dataset: 'production',
	plugins: [structureTool(), visionTool()],
	schema: {
		types: schemaTypes
	}
});
