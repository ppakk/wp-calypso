/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';

const strings = {
	topProducts: {
		title: translate( 'Products' ),
		label: { key: 'label', value: translate( 'Title' ) },
		values: [
			{ key: 'quantity', value: translate( 'Quantity' ) },
			{ key: 'total', value: translate( 'Total' ) },
		],
		empty: translate( 'No products found' ),
	}
};

export default strings;
