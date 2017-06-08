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
import { loginSocialUser, createSocialAccount } from 'state/login/actions';
import {
	getCreatedSocialAccountUsername,
	getCreatedSocialAccountBearerToken,
	isSocialAccountCreating,
	getCreateSocialAccountError,
	getRequestSocialAccountError,

} from 'state/login/selectors';
import { errorNotice, infoNotice, removeNotice } from 'state/notices/actions';
import WpcomLoginForm from 'signup/wpcom-login-form';

class GlobalNotice extends Component {
	static propTypes = {
		displayNotice: PropTypes.func.isRequired,
		removeNotice: PropTypes.func.isRequired,
		text: PropTypes.string.isRequired,
	};

	componentWillMount() {
		const { notice } = this.props.displayNotice( this.props.text );
		this.notice = notice;
	}

	componentWillUnmount() {
		if ( this.notice ) {
			this.props.removeNotice( this.notice.noticeId );
		}
	}

	render() {
		return null;
	}
}

const Notice = connect(
	null,
	{
		errorNotice,
		infoNotice,
		removeNotice,
	},
	( stateProps, dispatchProps, ownProps ) => ( {
		...ownProps,
		displayNotice: ownProps.type === 'info' ? dispatchProps.infoNotice : dispatchProps.errorNotice,
		removeNotice: dispatchProps.removeNotice
	} )
)( GlobalNotice );

class SocialLoginForm extends Component {
	static propTypes = {
		errorNotice: PropTypes.func.isRequired,
		infoNotice: PropTypes.func.isRequired,
		removeNotice: PropTypes.func.isRequired,
		onSuccess: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
		loginSocialUser: PropTypes.func.isRequired,
		createSocialAccount: PropTypes.func.isRequired,
		requestAccountError: PropTypes.object,
		createAccountError: PropTypes.object,
	};

	handleGoogleResponse = ( response ) => {
		if ( ! response.Zi || ! response.Zi.id_token ) {
			return;
		}

		this.props.loginSocialUser( 'google', response.Zi.id_token )
			.then(
				() => {
					this.props.recordTracksEvent( 'calypso_social_login_form_login_success', {
						social_account_type: 'google',
					} );

					this.props.onSuccess()
				},
				error => {
					if ( error.code === 'unknown_user' ) {
						return this.props.createSocialAccount( 'google', response.Zi.id_token )
							.then(
								() => this.props.recordTracksEvent( 'calypso_social_login_form_signup_success', {
									social_account_type: 'google',
								} ),
								error => this.props.recordTracksEvent( 'calypso_social_login_form_signup_fail', {
									social_account_type: 'google',
									error: error.message
								} )
							)
					}

					this.props.recordTracksEvent( 'calypso_social_login_form_login_fail', {
						social_account_type: 'google',
						error: error.message
					} );
				}
			);
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

				{ this.props.isSocialAccountCreating && <Notice
					type="info"
					text={ this.props.translate( 'Creating your account' ) }
				/> }

				{ this.props.createAccountError && <Notice
					type="error"
					text={ this.props.createAccountError.message }
				/> }

				{ ( this.props.requestAccountError && this.props.requestAccountError.type !== 'unknown_user' ) &&
					<Notice
						type="error"
						text={ this.props.requestAccountError.message }
					/>
				}

				{ this.props.bearerToken && (
					<WpcomLoginForm
						log={ this.props.username }
						authorization={ 'Bearer ' + this.props.bearerToken }
						redirectTo="/start"
					/>
				) }
			</div>
		);
	}
}

export default connect(
	state => ( {
		isSocialAccountCreating: isSocialAccountCreating( state ),
		bearerToken: getCreatedSocialAccountBearerToken( state ),
		username: getCreatedSocialAccountUsername( state ),
		createAccountError: getCreateSocialAccountError( state ),
		requestAccountError: getRequestSocialAccountError( state ),
	} ),
	{
		errorNotice,
		infoNotice,
		removeNotice,
		loginSocialUser,
		createSocialAccount,
	}
)( localize( SocialLoginForm ) );
