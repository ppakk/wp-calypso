/**
 * External dependencies
 */
import React, { PureComponent } from 'react';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import FrForm from 'components/domains/registrant-extra-info/fr-form';
import CaForm from 'components/domains/registrant-extra-info/ca-form';
import { forDomainRegistrations as getCountries } from 'lib/countries-list';
const countriesList = getCountries();

class ExtraInfoFrFormExample extends PureComponent {
	state = {
		registrantExtraInfo: {
			extra: {},
		},
	}

	handleExtraChange = ( registrantExtraInfo ) => {
		this.setState( { registrantExtraInfo } );
	}

	render() {
		return (
			<div>
				<p>
					The Fr Extra Registrant Information form collects the extra data
					required by AFNIC.
				</p>

				<Card>
					<FrForm
						contactDetails={ this.state.registrantExtraInfo }
						countriesList={ countriesList }
						updateContactDetailsCache={ this.handleExtraChange } >
					</FrForm>
				</Card>
				<Card>
					<CaForm
						values={ this.state.caExtraInfo }
						onChange={ this.handleExtraChange } >
					</CaForm>
				</Card>
			</div>
		);
	}
}

export default ExtraInfoFrFormExample;
