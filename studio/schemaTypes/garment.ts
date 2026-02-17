import { defineType, defineField } from 'sanity';

export const garment = defineType({
	name: 'garment',
	title: 'Plagg',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Navn',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'zone',
			title: 'Kategori',
			type: 'string',
			options: {
				list: [
					{ title: 'Hodeplagg', value: 'hodeplagg' },
					{ title: 'Overdel', value: 'overdel' },
					{ title: 'Underdel', value: 'underdel' },
					{ title: 'Sko', value: 'sko' },
					{ title: 'Tilbehør', value: 'tilbehor' }
				]
			},
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'image',
			title: 'Bilde',
			type: 'image',
			options: { hotspot: true },
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'overlay',
			title: 'Overlay (transparent)',
			type: 'image',
			options: { hotspot: true }
		}),
		defineField({
			name: 'color',
			title: 'Farge',
			type: 'string'
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
					{ title: 'Jobb', value: 'jobb' },
					{ title: 'Trening', value: 'trening' },
					{ title: 'Varmt', value: 'varmt' },
					{ title: 'Kaldt', value: 'kaldt' },
					{ title: 'Regn', value: 'regn' }
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
			zone: 'zone',
			media: 'image'
		},
		prepare({ title, zone, media }) {
			return {
				title: title || 'Uten navn',
				subtitle: zone || '',
				media
			};
		}
	}
});

