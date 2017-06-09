/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import FormTextInput from 'components/forms/form-text-input';
import FormToggle from 'components/forms/form-toggle';
import FormSelect from 'components/forms/form-select';
import { getNewMethodTypeOptions } from 'woocommerce/state/ui/shipping/zones/methods/selectors';

const ShippingZoneMethod = ( { enabled, method_id, newMethodTypeOptions, method_title, translate } ) => {
	const methodNames = {
		flat_rate: translate( 'Flat Rate' ),
		free_shipping: translate( 'Free Shipping' ),
		local_pickup: translate( 'Local Pickup' )
	};

	return (
		<div>
			<FormTextInput value={ method_title } />
			<FormToggle checked={ enabled } />
			<FormSelect
				value={ method_id } >
				<option value={ method_id } key={ -1 }>{ methodNames[ method_id ] }</option>
				{ newMethodTypeOptions.map( ( newMethodId, index ) => (
					<option value={ newMethodId } key={ index }>{ methodNames[ newMethodId ] }</option>
				) ) }
			</FormSelect>
		</div>
	);
};

ShippingZoneMethod.propTypes = {
	zoneId: PropTypes.oneOfType( [ PropTypes.number, PropTypes.object ] ),
	enabled: PropTypes.bool,
	id: PropTypes.oneOfType( [ PropTypes.number, PropTypes.object ] ),
	method_id: PropTypes.string,
	method_title: PropTypes.string,
	settings: PropTypes.object,
};

export default connect(
	( state, ownProps ) => ( {
		newMethodTypeOptions: getNewMethodTypeOptions( state, ownProps.zoneId )
	} ),
	( dispatch ) => ( bindActionCreators( {}, dispatch ) )
)( localize( ShippingZoneMethod ) );
