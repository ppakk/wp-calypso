/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import {
	getSiteStatsNormalizedData
} from 'state/stats/lists/selectors';
import Card from 'components/card';

const StoreStatsList = ( { data, label, values } ) => {
	return (
		<Card compact>
			<table>
				<thead>
				<tr>
					<th>{ label.value }</th>
					{ values.map( v => (
						<th key={ v.key }>{ v.value }</th>
					) ) }
				</tr>
				</thead>
				<tbody>
				{ data.map( d => (
					<tr key={ d[ label.key ] }>
						<td>{ d[ label.key ] }</td>
						{ values.map( v => (
							<td key={ v.key }>{ d[ v.key ] }</td>
						) ) }
					</tr>
				) ) }
				</tbody>
			</table>
		</Card>
	);
};

StoreStatsList.propTypes = {
	data: PropTypes.array.isRequired,
	label: PropTypes.object.isRequired,
	values: PropTypes.array.isRequired,
};

export default connect(
	( state, { siteId, statType, query } ) => {
		return {
			data: getSiteStatsNormalizedData( state, siteId, statType, query ),
		};
	}
)( StoreStatsList );
