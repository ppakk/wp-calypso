/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Gridicon from 'gridicons';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Spinner from 'components/spinner';
import { getShippingZoneMethods, areShippingZoneMethodsLoaded } from 'woocommerce/state/sites/shipping-zone-methods/selectors';
import { openShippingZoneForEdit } from 'woocommerce/state/ui/shipping/zones/actions';
import { getSelectedSiteId } from 'state/ui/selectors';

const ShippingZone = ( { translate, id, name, methods, loaded, siteId, ...props } ) => {
	const renderMethod = ( methodKey ) => {
		const method = methods[ methodKey ];

		return (
			<div key={ methodKey } className="shipping__zones-row-method">
				<p className="shipping__zones-row-method-name">{ method.method_title }</p>
				{ /*<p className="shipping__zones-row-method-description">{ method.method_description }</p>*/ }
			</div>
		);
	};

	const renderMethods = () => {
		if ( ! loaded ) {
			return (
				<div className="shipping__loading-spinner">
					<Spinner size={ 24 } />
				</div>
			);
		}

		return Object.keys( methods ).map( renderMethod );
	};

	const onEditClick = () => ( props.openShippingZoneForEdit( siteId, id ) );

	const icon = 0 === id ? 'globe' : 'location';

	return (
		<div className="shipping__zones-row">
			<div className="shipping__zones-row-icon">
				<Gridicon icon={ icon } size={ 36 } />
			</div>
			<div className="shipping__zones-row-location">
				<p className="shipping__zones-row-location-name">{ name }</p>
				{ /*<p className="shipping__zones-row-location-description">{ locationDescription }</p>*/ }
			</div>
			<div className="shipping__zones-row-methods">
				{ renderMethods() }
			</div>
			<div className="shipping__zones-row-actions">
				<Button compact onClick={ onEditClick }>{ translate( 'Edit' ) }</Button>
			</div>
		</div>
	);
};

ShippingZone.propTypes = {
	id: PropTypes.number,
	name: PropTypes.string
};

export default connect(
	( state, ownProps ) => ( {
		siteId: getSelectedSiteId( state ),
		methods: getShippingZoneMethods( state, ownProps.id ),
		loaded: areShippingZoneMethodsLoaded( state, ownProps.id )
	} ),
	( dispatch ) => (
		bindActionCreators( {
			openShippingZoneForEdit
		}, dispatch )
	)
)( localize( ShippingZone ) );
