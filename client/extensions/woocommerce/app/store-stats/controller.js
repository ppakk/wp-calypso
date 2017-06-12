/**
 * External dependencies
 */
import React from 'react';
import page from 'page';
import includes from 'lodash/includes';
import { moment } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { renderWithReduxStore } from 'lib/react-helpers';
import AsyncLoad from 'components/async-load';
import StatsPagePlaceholder from 'my-sites/stats/stats-page-placeholder';
import { UNITS } from './constants';

function isValidParameters( context ) {
	const validParameters = {
		type: [ 'orders' ],
		unit: [ 'day', 'week', 'month', 'year' ],
	};
	return Object.keys( validParameters )
		.every( param => includes( validParameters[ param ], context.params[ param ] ) );
}

function getQueryDate( context ) {
	const { unit } = context.params;
	const unitConfig = UNITS[ unit ];
	const today = moment();
	const startDate = moment( context.query.startDate ); // Defaults to today if startDate undefined
	const unitQuantity = unitConfig.quantity;
	const duration = Math.floor( moment.duration( today - startDate )[ unitConfig.durationFn ]() );
	const periods = Math.floor( duration / unitQuantity ) * unitQuantity;
	return today.subtract( periods, unitConfig.label ).format( 'YYYY-MM-DD' );
}

export default function StatsController( context ) {
	if ( ! isValidParameters( context ) ) {
		page.redirect( `/store/stats/orders/day/${ context.params.site }` );
	}
	const queryDate = getQueryDate( context );
	const props = {
		type: context.params.type,
		unit: context.params.unit,
		path: context.pathname,
		queryDate,
		selectedDate: context.query.startDate || moment().format( 'YYYY-MM-DD' ),
	};
	renderWithReduxStore(
		<AsyncLoad
			/* eslint-disable wpcalypso/jsx-classname-namespace */
			placeholder={ <StatsPagePlaceholder className="woocommerce" /> }
			/* eslint-enable wpcalypso/jsx-classname-namespace */
			require="extensions/woocommerce/app/store-stats"
			{ ...props }
		/>,
		document.getElementById( 'primary' ),
		context.store
	);
}
