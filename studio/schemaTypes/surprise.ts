import { defineType, defineField } from 'sanity';

export const surprise = defineType({
	name: 'surprise',
	title: 'Overraskelse',
	type: 'object',
	fields: [
		defineField({
			name: 'unlockDate',
			title: 'Åpningsdato',
			type: 'date',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'type',
			title: 'Type',
			type: 'string',
			options: {
				list: [
					{ title: 'Aktivitet', value: 'activity' },
					{ title: 'Restaurant', value: 'restaurant' },
					{ title: 'Overraskelse', value: 'surprise' }
				]
			},
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'title',
			title: 'Tittel',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'description',
			title: 'Beskrivelse',
			type: 'text',
			rows: 3
		}),
		defineField({
			name: 'icon',
			title: 'Ikon',
			type: 'string'
		})
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'unlockDate',
			icon: 'icon'
		},
		prepare({ title, subtitle, icon }) {
			return {
				title: `${icon || ''} ${title}`,
				subtitle
			};
		}
	}
});
