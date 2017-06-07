/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GoogleLoginButton from 'components/social-buttons/google';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import config from 'config';
import { loginSocialUser } from 'state/login/actions';
import { errorNotice, infoNotice, removeNotice } from 'state/notices/actions';
import wpcom from 'lib/wp';
import WpcomLoginForm from 'signup/wpcom-login-form';

class SocialLoginForm extends Component {
	static propTypes = {
		errorNotice: PropTypes.func.isRequired,
		infoNotice: PropTypes.func.isRequired,
		removeNotice: PropTypes.func.isRequired,
		onSuccess: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
	};

	state = {
		username: null,
		bearerToken: null,
	};

	handleGoogleResponse = ( response ) => {
		if ( ! response.Zi || ! response.Zi.id_token ) {
			return;
		}

		let creatingAccountNotice = null;

		this.props.loginSocialUser( 'google', response.Zi.id_token, () => {
			const { notice } = this.props.infoNotice( this.props.translate( 'Creating your account' ) );
			creatingAccountNotice = notice;
			return true;
		} ).then( result => {
			if ( creatingAccountNotice ) {
				this.props.removeNotice( creatingAccountNotice.noticeId );
			}

			if ( result ) {
				this.setState( result );
			}

			this.props.recordTracksEvent( 'calypso_social_login_form_login_success', {
				social_account_type: 'google',
			} );

			this.props.onSuccess();
		}, error => {
			if ( creatingAccountNotice ) {
				this.props.removeNotice( creatingAccountNotice.noticeId );
			}

			this.props.recordTracksEvent( 'calypso_social_login_form_signup_fail', {
				social_account_type: 'google',
				error: error.message
			} );

			this.props.errorNotice( error.message );
		} );
	};

	render() {
		return (
			<div className="login__social">
				<p className="login__social-text">
					{ this.props.translate( 'Or login with your existing social profile:' ) }
				</p>

				<div className="login__social-buttons">
					<GoogleLoginButton
						clientId={ config( 'google_oauth_client_id' ) }
						responseHandler={ this.handleGoogleResponse } />
				</div>

				{ this.state.bearerToken && (
					<WpcomLoginForm
						log={ this.state.username }
						authorization={ 'Bearer ' + this.state.bearerToken }
						redirectTo="/start"
					/>
				) }
			</div>
		);
	}
}

export default connect(
	null,
	{
		errorNotice,
		infoNotice,
		removeNotice,
		loginSocialUser,
	}
)( localize( SocialLoginForm ) );
