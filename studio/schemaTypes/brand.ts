import { defineType, defineField } from 'sanity';

export const brand = defineType({
	name: 'brand',
	title: 'Merke',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Navn',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'logo',
			title: 'Logo',
			type: 'image',
			options: { hotspot: true }
		})
	],
	preview: {
		select: {
			title: 'name',
			media: 'logo'
		}
	}
});
