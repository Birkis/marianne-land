import { defineType, defineField } from 'sanity';

export const trip = defineType({
	name: 'trip',
	title: 'Trip',
	type: 'document',
	fields: [
		defineField({
			name: 'destination',
			title: 'Destinasjon',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'destination' },
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'emoji',
			title: 'Emoji',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'tagline',
			title: 'Tagline',
			type: 'string'
		}),
		defineField({
			name: 'departureDate',
			title: 'Avreisedato',
			type: 'date',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'returnDate',
			title: 'Returdato',
			type: 'date',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'flights',
			title: 'Flyreiser',
			type: 'array',
			of: [{ type: 'flightInfo' }]
		}),
		defineField({
			name: 'surprises',
			title: 'Overraskelser',
			type: 'array',
			of: [{ type: 'surprise' }]
		}),
		defineField({
			name: 'photos',
			title: 'Bilder',
			type: 'array',
			of: [{ type: 'image', options: { hotspot: true } }]
		})
	],
	preview: {
		select: {
			title: 'destination',
			subtitle: 'departureDate',
			emoji: 'emoji'
		},
		prepare({ title, subtitle, emoji }) {
			return {
				title: `${emoji || ''} ${title}`,
				subtitle
			};
		}
	}
});
