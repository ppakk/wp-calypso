/**
 * External dependencies
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import ExtendedHeader from 'woocommerce/components/extended-header';
import ShippingZone from './shipping-zone';
import ShippingZoneDialog from './shipping-zone-dialog';
import Spinner from 'components/spinner';
import { addNewShippingZone } from 'woocommerce/state/ui/shipping/zones/actions';
import { fetchShippingZones } from 'woocommerce/state/sites/shipping-zones/actions';
import {
	getAPIShippingZones,
	areShippingZonesLoaded,
	areShippingZonesLoading
} from 'woocommerce/state/sites/shipping-zones/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';

class ShippingZoneList extends Component {
	componentWillMount() {
		if ( this.props.siteId ) {
			this.props.fetchShippingZones( this.props.siteId );
		}
	}

	componentWillReceiveProps( { siteId } ) {
		if ( siteId === this.props.siteId ) {
			return;
		}

		this.props.fetchShippingZones( siteId );
	}

	renderContent() {
		if ( ! this.props.loaded ) {
			return (
				<div className="shipping__loading-spinner">
					<Spinner size={ 24 } />
				</div>
			);
		}

		const { translate } = this.props;

		const renderShippingZone = ( zone, index ) => {
			return ( <ShippingZone key={ index } { ...zone } /> );
		};

		const sortedZones = [ ...this.props.shippingZones ].sort( ( z1, z2 ) => {
			//Rest of the World should always be at the bottom
			if ( 0 === z1.id ) {
				return 1;
			}

			//Order by the order of creation, unless overriden
			if ( z1.order === z2.order ) {
				return z1.id - z2.id;
			}

			return z1.order - z2.order;
		} );

		return (
			<div>
				<div className="shipping__zones-row shipping__zones-header">
					<div className="shipping__zones-row-icon"></div>
					<div className="shipping__zones-row-location">{ translate( 'Location' ) }</div>
					<div className="shipping__zones-row-methods">{ translate( 'Shipping methods' ) }</div>
					<div className="shipping__zones-row-actions" />
				</div>
				{ sortedZones.map( renderShippingZone ) }
			</div>
		);
	}

	render() {
		const { siteId, translate } = this.props;

		const onAddZoneClick = () => ( this.props.addNewShippingZone( siteId ) );

		return (
			<div>
				<ExtendedHeader
					label={ translate( 'Shipping Zones' ) }
					description={ translate( 'The regions you ship to and the methods you will provide.' ) }>
					<Button onClick={ onAddZoneClick }>{ translate( 'Add zone' ) }</Button>
				</ExtendedHeader>
				<Card className="shipping__zones">
					{ this.renderContent() }
				</Card>
				<ShippingZoneDialog />
			</div>
		);
	}
}

export default connect(
	( state ) => ( {
		siteId: getSelectedSiteId( state ),
		shippingZones: getAPIShippingZones( state ),
		loading: areShippingZonesLoading( state ),
		loaded: areShippingZonesLoaded( state )
	} ),
	( dispatch ) => (
		bindActionCreators( {
			fetchShippingZones,
			addNewShippingZone
		}, dispatch )
	)
)( localize( ShippingZoneList ) );
