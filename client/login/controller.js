/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import WPLogin from './wp-login';
import MagicLogin from './magic-login';
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
// @todo record some event
//				this.props.recordTracksEvent( 'calypso_login_magic_link_interstitial_view' );
		context.primary = <HandleEmailedLinkForm />;

		next();
	},
};
