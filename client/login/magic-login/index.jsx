/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import page from 'page';

/**
 * Internal dependencies
 */
import { isEnabled } from 'config';
import notices from 'notices';
import { login } from 'lib/paths';
import {
	CHECK_YOUR_EMAIL_PAGE,
	LINK_EXPIRED_PAGE,
} from 'state/login/magic-login/constants';
import {
	getMagicLoginEmailAddressFormInput,
	getMagicLoginCurrentView,
} from 'state/selectors';
import { getCurrentQueryArguments } from 'state/ui/selectors';
import {
	hideMagicLoginRequestForm,
} from 'state/login/magic-login/actions';
import { recordTracksEvent } from 'state/analytics/actions';
import Main from 'components/main';
import EmailedLoginLinkSuccessfully from './emailed-login-link-successfully';
import EmailedLoginLinkExpired from './emailed-login-link-expired';
import RequestLoginEmailForm from './request-login-email-form';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import GlobalNotices from 'components/global-notices';

class MagicLogin extends React.Component {
	static propTypes = {
		hideMagicLoginRequestForm: PropTypes.func.isRequired,
		magicLoginEmailAddress: PropTypes.string,
		magicLoginEnabled: PropTypes.bool,
		magicLoginView: PropTypes.string,
		recordTracksEvent: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
	};

	onClickEnterPasswordInstead = event => {
		event.preventDefault();
		this.props.recordTracksEvent( 'calypso_login_enter_password_instead_click' );

		page( login( { isNative: true } ) );
	};

	magicLoginMainContent() {
		const {
			magicLoginView,
			magicLoginEmailAddress,
		} = this.props;

		switch ( magicLoginView ) {
			case LINK_EXPIRED_PAGE:
				this.props.recordTracksEvent( 'calypso_login_magic_link_expired_link_view' );
				return <EmailedLoginLinkExpired />;
			case CHECK_YOUR_EMAIL_PAGE:
				this.props.recordTracksEvent( 'calypso_login_magic_link_link_sent_view' );
				return <EmailedLoginLinkSuccessfully emailAddress={ magicLoginEmailAddress } />;
		}
	}

	render() {
		const {
			translate,
		} = this.props;

		return (
			<Main className="magic-login">
				{ /* @todo dynamic title */ }
				<PageViewTracker path="/log-in/link" title="Magic Login" />

				<GlobalNotices id="notices" notices={ notices.list } />
{ /* @todo investigate key below */ }
				{ this.magicLoginMainContent() || (
					<div>
						<RequestLoginEmailForm />
						<div className="magic-login__footer">
							<a href="#"
								key="enter-password-link"
								onClick={ this.onClickEnterPasswordInstead }>
								{ translate( 'Enter a password instead' ) }
							</a>
						</div>
					</div>
				) }
			</Main>
		);
	}
}

const mapState = state => {
	const magicLoginEnabled = isEnabled( 'login/magic-login' );
	return {
		magicLoginEnabled,
		magicLoginEmailAddress: getMagicLoginEmailAddressFormInput( state ),
		magicLoginView: magicLoginEnabled ? getMagicLoginCurrentView( state ) : null,
		queryArguments: getCurrentQueryArguments( state ),
	};
};

const mapDispatch = {
	hideMagicLoginRequestForm,
	recordTracksEvent,
};

export default connect( mapState, mapDispatch )( localize( MagicLogin ) );
