/**
 * External dependencies
 */
import React from 'react';
import emailValidator from 'email-validator';

/**
 * Internal dependencies
 */
import WPLogin from './wp-login';
import MagicLogin from './magic-login';
import EmailedLoginLinkExpired from './magic-login/emailed-login-link-expired';
import HandleEmailedLinkForm from './magic-login/handle-emailed-link-form';

export default {
	login( context, next ) {
		const { lang, path, params } = context;

		context.primary = (
			<WPLogin locale={ lang } path={ path } twoFactorAuthType={ params.twoFactorAuthType } />
		);
		next();
	},

	magicLogin( context, next ) {
		context.primary = <MagicLogin />;
		next();
	},

	magicLoginUse( context, next ) {
		// queryArguments isn't set in redux in time for this initial render -- pull 'em out here.
		const {
			client_id,
			email,
			token,
			tt,
		} = context.query;

		if ( email && emailValidator.validate( email ) && token && tt ) {
			context.primary = <HandleEmailedLinkForm clientId={ client_id } emailAddress={ email } token={ token } tokenTime={ tt } />;
		} else {
			context.primary = <EmailedLoginLinkExpired />;
		}
		next();
	},
};
