/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	makeProductActionList,
} from '../actions';
import {
	WOOCOMMERCE_API_CREATE_PRODUCT,
} from '../../../action-types';

describe( 'makeProductActionList', () => {
	it( 'should return null when there are no edits', () => {
		expect( makeProductActionList( null, 123, null ) ).to.equal.null;
	} );

	it( 'should return a single API request for a single simple product create', () => {
		const edits = {
			creates: [
				{ id: { index: 0 }, name: 'Product #1' },
			]
		};

		const actionList = [
			{ operation: WOOCOMMERCE_API_CREATE_PRODUCT, payload: { siteId: 123, id: { index: 0 } } },
		];

		expect( makeProductActionList( null, 123, edits ) ).to.eql( actionList );
	} );

	it( 'should return multiple API create requests for multiple products to be created', () => {
		const edits = {
			creates: [
				{ id: { index: 0 }, name: 'Product #1' },
				{ id: { index: 1 }, name: 'Product #2' },
			]
		};

		const actionList = [
			{ operation: WOOCOMMERCE_API_CREATE_PRODUCT, payload: { siteId: 123, id: { index: 0 } } },
			{ operation: WOOCOMMERCE_API_CREATE_PRODUCT, payload: { siteId: 123, id: { index: 1 } } },
		];

		expect( makeProductActionList( null, 123, edits ) ).to.eql( actionList );
	} );
} );

