/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import Navigation from './store-stats-navigation';
import { getSelectedSiteId } from 'state/ui/selectors';
import Chart from './store-stats-chart';
import Module from './store-stats-module';
import List from './store-stats-list';
import SectionHeader from 'components/section-header';
import StoreStrings from 'woocommerce/app/store-stats/store-strings';

class StoreStats extends Component {
	static propTypes = {
		siteId: PropTypes.number,
		unit: PropTypes.string.isRequired,
		startDate: PropTypes.string,
		path: PropTypes.string.isRequired,
	};

	render() {
		const { siteId, unit, startDate, path } = this.props;
		const today = this.props.moment().format( 'YYYY-MM-DD' );
		const selectedDate = startDate || today;
		const ordersQuery = {
			unit,
			date: today,
			quantity: '30'
		};
		const topSellersQuery = {
			unit,
			date: selectedDate,
			quantity: '7',
			limit: '3',
		};
		const { topProducts } = StoreStrings;
		const topProductsHeader = (
			<SectionHeader href={ '/store/stats/products' }>{ topProducts.title }</SectionHeader>
		);
		return (
			<Main className="store-stats woocommerce" wideLayout={ true }>
				<Navigation unit={ unit } type="orders" />
				<Chart
					path={ path }
					query={ ordersQuery }
					selectedDate={ selectedDate }
					siteId={ siteId }
					unit={ unit }
				/>
				<Module
					siteId={ siteId }
					header={ topProductsHeader }
					emptyMessage={ topProducts.empty }
					query={ topSellersQuery }
					statType="statsTopSellers"
				>
					<List
						siteId={ siteId }
						values={ topProducts.values }
						label={ topProducts.label }
						query={ topSellersQuery }
						statType="statsTopSellers"
					/>
				</Module>
			</Main>
		);
	}
}

const localizedStats = localize( StoreStats );

export default connect(
	state => {
		return {
			siteId: getSelectedSiteId( state ),
		};
	}
)( localizedStats );
