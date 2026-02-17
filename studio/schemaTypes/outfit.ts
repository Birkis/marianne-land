import { defineType, defineField } from 'sanity';

function garmentRefField(name: string, title: string, zone: string) {
	return defineField({
		name,
		title,
		type: 'reference',
		to: [{ type: 'garment' }],
		options: {
			filter: 'zone == $zone',
			filterParams: { zone }
		}
	});
}

export const outfit = defineType({
	name: 'outfit',
	title: 'Antrekk',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Navn',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		garmentRefField('hodeplagg', 'Hodeplagg', 'hodeplagg'),
		garmentRefField('overdel', 'Overdel', 'overdel'),
		garmentRefField('underdel', 'Underdel', 'underdel'),
		garmentRefField('sko', 'Sko', 'sko'),
		garmentRefField('tilbehor', 'Tilbehør', 'tilbehor')
	],
	preview: {
		select: {
			title: 'name'
		},
		prepare({ title }) {
			return {
				title: title || 'Uten navn'
			};
		}
	}
});

