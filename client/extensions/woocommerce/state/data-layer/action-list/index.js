/**
 * Internal dependencies
 */
import {
	WOOCOMMERCE_ACTION_LIST_STEP_START,
	WOOCOMMERCE_ACTION_LIST_STEP_END,
} from 'woocommerce/state/action-types';

function stepStart( { dispatch, getState }, action, next ) {
	const { stepIndex } = action.payload;
	console.log( 'Starting step #' + stepIndex );
}

function stepEnd( { dispatch, getState }, action, next ) {
	const { stepIndex, error } = action.payload;
	console.log( 'Ending step #' + stepIndex );
	if ( error ) {
		console.log( '  Error: ', error );
	}
}

export default {
	[ WOOCOMMERCE_ACTION_LIST_STEP_START ]: [ stepStart ],
	[ WOOCOMMERCE_ACTION_LIST_STEP_END ]: [ stepEnd ],
};

