/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { includes } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import FormTextInput from 'components/forms/form-text-input';
import FormToggle from 'components/forms/form-toggle';
import FormSelect from 'components/forms/form-select';
import { getNewMethodTypeOptions } from 'woocommerce/state/ui/shipping/zones/methods/selectors';
import {
	changeShippingZoneMethodTitle,
	changeShippingZoneMethodType
} from 'woocommerce/state/ui/shipping/zones/methods/actions';

const ShippingZoneMethod = ( { siteId, id, enabled, methodType, newMethodTypeOptions, title, translate, ...props } ) => {
	const methodNames = {
		flat_rate: translate( 'Flat Rate' ),
		free_shipping: translate( 'Free Shipping' ),
		local_pickup: translate( 'Local Pickup' )
	};

	const renderMethodTypeOptions = () => {
		const options = newMethodTypeOptions.map( ( newMethodId, index ) => (
			<option value={ newMethodId } key={ index }>{ methodNames[ newMethodId ] }</option>
		) );

		if ( ! includes( newMethodTypeOptions, methodType ) ) {
			options.unshift( <option value={ methodType } key={ -1 }>{ methodNames[ methodType ] }</option> );
		}

		return options;
	};

	const onMethodTitleChange = ( event ) => ( props.changeShippingZoneMethodTitle( siteId, id, event.target.value ) );
	const onMethodTypeChange = ( event ) => ( props.changeShippingZoneMethodType( siteId, id, event.target.value ) );

	return (
		<div>
			<FormTextInput value={ title || '' } onChange={ onMethodTitleChange } />
			<FormToggle checked={ enabled } />
			<FormSelect
				value={ methodType }
				onChange={ onMethodTypeChange }>
				{ renderMethodTypeOptions() }
			</FormSelect>
		</div>
	);
};

ShippingZoneMethod.propTypes = {
	siteId: PropTypes.number,
	zoneId: PropTypes.oneOfType( [ PropTypes.number, PropTypes.object ] ),
	enabled: PropTypes.bool,
	id: PropTypes.oneOfType( [ PropTypes.number, PropTypes.object ] ),
	methodType: PropTypes.string,
	title: PropTypes.string,
	settings: PropTypes.object,
};

export default connect(
	( state ) => ( {
		newMethodTypeOptions: getNewMethodTypeOptions( state )
	} ),
	( dispatch ) => ( bindActionCreators( {
		changeShippingZoneMethodTitle,
		changeShippingZoneMethodType
	}, dispatch ) )
)( localize( ShippingZoneMethod ) );
