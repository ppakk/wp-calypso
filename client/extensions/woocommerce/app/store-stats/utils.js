/**
 * External dependencies
 */
import { includes } from 'lodash';

/**
 * @typedef {Object} Delta
 * @property {string} classes - CSS classes to be used to render arrows
 * @property {string} since - Use of labels to create a phrase, "Since May 2"
 * @property {Array} value - Value as a percent
 */

/**
 * Calculate all elements needed to render a delta on a time series.
 *
 * @param {Object} item - data point from a time series
 * @param {Object|undefined} previousItem - the previous data point, if it exists
 * @param {string} attr - the property name to compare
 * @param {string} unit - day, week, month, or year
 * @return {Delta} - An object used to render the UI element
 */
export function calculateDelta( item, previousItem, attr, unit ) {
	const negativeIsFavourable = [ 'total_refund' ];
	const sinceLabels = {
		day: 'labelDay',
		week: 'labelWeek',
		month: 'labelMonth',
		year: 'labelYear',
	};
	let value = 0;
	if ( previousItem && previousItem[ attr ] !== 0 ) {
		const current = item[ attr ];
		const previous = previousItem[ attr ];
		value = ( current - previous ) / previous;
	}
	const isIncreaseFavorable = ! includes( negativeIsFavourable, attr );
	const sinceLabel = previousItem ? `since ${ previousItem[ sinceLabels[ unit ] ] }` : null;

	return {
		isIncreaseFavorable,
		sinceLabel,
		value,
	};
}
