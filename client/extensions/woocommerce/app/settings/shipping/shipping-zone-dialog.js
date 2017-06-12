/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { isNumber } from 'lodash';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Dialog from 'components/dialog';
import FormFieldSet from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import ShippingZoneMethod from './shipping-zone-method';
import TokenField from 'components/token-field';
import {
	isCurrentlyEditingShippingZone,
	getCurrentlyEditingShippingZone
} from 'woocommerce/state/ui/shipping/zones/selectors';
import { addMethodToShippingZone } from 'woocommerce/state/ui/shipping/zones/methods/actions';
import {
	getCurrentlyEditingShippingZoneMethods,
	getNewMethodTypeOptions
} from 'woocommerce/state/ui/shipping/zones/methods/selectors';
import {
	changeShippingZoneName,
	closeEditingShippingZone,
	cancelEditingShippingZone
} from 'woocommerce/state/ui/shipping/zones/actions';

class ShippingZoneDialog extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			location: []
		};
	}

	render() {
		const { zone, methods, siteId, translate, newMethodTypeOptions, isVisible } = this.props;
		const { id, name } = zone || {};
		const isEditing = isNumber( id );

		const onCancel = () => ( this.props.cancelEditingShippingZone( siteId ) );
		const onClose = () => ( this.props.closeEditingShippingZone( siteId ) );
		const onNameChange = ( event ) => ( this.props.changeShippingZoneName( siteId, event.target.value ) );
		const addMethod = () => ( this.props.addMethodToShippingZone( siteId, newMethodTypeOptions[ 0 ] ) );

		const onLocationChange = ( location ) => {
			this.setState( { location } );
		};

		const renderShippingMethod = ( method, index ) => {
			return (
				<ShippingZoneMethod key={ index } siteId={ siteId } { ...method } />
			);
		};

		const buttons = [
			{ action: 'cancel', label: translate( 'Cancel' ) },
			{ action: 'add', label: isEditing ? translate( 'Save' ) : translate( 'Add zone' ), onClick: onClose, isPrimary: true },
		];

		return (
			<Dialog
				additionalClassNames="shipping__zone-dialog woocommerce"
				isVisible={ isVisible }
				buttons={ buttons }
				onClose={ onCancel } >
				<div className="shipping__zone-dialog-header">{ translate( 'Add new shipping zone' ) }</div>
				<FormFieldSet>
					<FormLabel htmlFor="zone-name">{ translate( 'Shipping zone name' ) }</FormLabel>
					<FormTextInput
						name="zone-name"
						placeholder={ translate( 'For your reference only, the customer will not see this' ) }
						value={ name || '' }
						onChange={ onNameChange } />
				</FormFieldSet>
				<FormFieldSet>
					<FormLabel>{ translate( 'Shipping location' ) }</FormLabel>
					<TokenField
						value={ this.state.location }
						onChange={ onLocationChange } />
				</FormFieldSet>
				<div>
					<FormLabel>{ translate( 'Shipping method' ) }</FormLabel>
					{ methods.map( renderShippingMethod ) }
				</div>
				<FormFieldSet>
					<Button compact onClick={ addMethod }>{ translate( 'Add another shipping method' ) }</Button>
				</FormFieldSet>
			</Dialog>
		);
	}
}

ShippingZoneDialog.propTypes = {
	siteId: PropTypes.number,
};

export default connect(
	( state ) => ( {
		isVisible: isCurrentlyEditingShippingZone( state ),
		newMethodTypeOptions: getNewMethodTypeOptions( state ),
		zone: getCurrentlyEditingShippingZone( state ),
		methods: getCurrentlyEditingShippingZoneMethods( state )
	} ),
	( dispatch ) => ( bindActionCreators( {
		addMethodToShippingZone,
		changeShippingZoneName,
		closeEditingShippingZone,
		cancelEditingShippingZone
	}, dispatch ) )
)( localize( ShippingZoneDialog ) );
