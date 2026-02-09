import { defineType, defineField } from 'sanity';

export const bag = defineType({
	name: 'bag',
	title: 'Veske',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Navn',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'brand',
			title: 'Merke',
			type: 'reference',
			to: [{ type: 'brand' }]
		}),
		defineField({
			name: 'color',
			title: 'Farge',
			type: 'string'
		}),
		defineField({
			name: 'image',
			title: 'Bilde',
			type: 'image',
			options: { hotspot: true },
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'tags',
			title: 'Tagger',
			type: 'array',
			of: [{ type: 'string' }],
			options: {
				list: [
					{ title: 'Hverdag', value: 'hverdag' },
					{ title: 'Fest', value: 'fest' },
					{ title: 'Reise', value: 'reise' },
					{ title: 'Liten', value: 'liten' },
					{ title: 'Stor', value: 'stor' }
				]
			}
		}),
		defineField({
			name: 'notes',
			title: 'Notater',
			type: 'text',
			rows: 3
		})
	],
	preview: {
		select: {
			title: 'name',
			brandName: 'brand.name',
			media: 'image'
		},
		prepare({ title, brandName, media }) {
			return {
				title: title || 'Uten navn',
				subtitle: brandName || '',
				media
			};
		}
	}
});
