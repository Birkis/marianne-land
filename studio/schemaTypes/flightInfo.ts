import { defineType, defineField } from 'sanity';

export const flightInfo = defineType({
	name: 'flightInfo',
	title: 'Flyinformasjon',
	type: 'object',
	fields: [
		defineField({
			name: 'direction',
			title: 'Retning',
			type: 'string',
			options: {
				list: [
					{ title: 'Utreise', value: 'outbound' },
					{ title: 'Retur', value: 'return' }
				]
			},
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'airline',
			title: 'Flyselskap',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'flightNumber',
			title: 'Flynummer',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'date',
			title: 'Dato',
			type: 'date',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'departureAirport',
			title: 'Avgangslufthavn',
			type: 'string',
			description: 'IATA-kode, f.eks. OSL',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'departureTime',
			title: 'Avgangstid',
			type: 'string',
			description: 'Format: HH:MM',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'arrivalAirport',
			title: 'Ankomstlufthavn',
			type: 'string',
			description: 'IATA-kode, f.eks. LHR',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'arrivalTime',
			title: 'Ankomsttid',
			type: 'string',
			description: 'Format: HH:MM',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'terminal',
			title: 'Terminal',
			type: 'string'
		}),
		defineField({
			name: 'gate',
			title: 'Gate',
			type: 'string'
		}),
		defineField({
			name: 'bookingReference',
			title: 'Bookingrefransenummer',
			type: 'string'
		}),
		defineField({
			name: 'seatInfo',
			title: 'Seter',
			type: 'string',
			description: 'F.eks. 14A, 14B'
		})
	],
	preview: {
		select: {
			direction: 'direction',
			flightNumber: 'flightNumber',
			departureAirport: 'departureAirport',
			arrivalAirport: 'arrivalAirport',
			date: 'date'
		},
		prepare({ direction, flightNumber, departureAirport, arrivalAirport, date }) {
			const dirLabel = direction === 'outbound' ? '✈️ Utreise' : '🔙 Retur';
			return {
				title: `${dirLabel} — ${flightNumber || ''}`,
				subtitle: `${departureAirport || ''} → ${arrivalAirport || ''} (${date || ''})`
			};
		}
	}
});
