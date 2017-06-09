/**
 * Internal dependencies
 */
import config from 'config';
import {
	login,
	magicLogin,
	magicLoginUse,
} from './controller';
import { makeLayout, redirectLoggedIn, setUpLocale } from 'controller';

export default router => {
	if ( config.isEnabled( 'login/magic-login' ) ) {
		router( '/log-in/link', redirectLoggedIn, magicLogin, makeLayout );
		router( '/log-in/link/use', redirectLoggedIn, magicLoginUse, makeLayout );
	}

	if ( config.isEnabled( 'login/wp-login' ) ) {
		router(
			'/log-in/:twoFactorAuthType(authenticator|backup|sms|push)?/:lang?',
			setUpLocale,
			redirectLoggedIn,
			login,
			makeLayout,
		);
	}
};
