/**
 * External dependencies
 */
import { assert } from 'chai';
/**
 * Internal dependencies
 */
import { calculateDelta } from '../utils';

describe( 'calculateDelta', () => {
	it( 'should return a correctly formed object', () => {
		const item = { doodads: 75 };
		const previousItem = { doodads: 50 };
		const delta = calculateDelta( item, previousItem, 'doodads', 'day' );
		assert.isObject( delta );
		assert.isNumber( delta.value );
		assert.isString( delta.sinceLabel );
	} );

	it( 'should return correct values', () => {
		const item = { doodads: 75 };
		const previousItem = { doodads: 50, labelDay: 'a fortnight' };
		const delta = calculateDelta( item, previousItem, 'doodads', 'day' );
		assert.equal( delta.value, 0.5 );
		assert.equal( delta.sinceLabel, 'since a fortnight' );
	} );

	it( 'should return correct sign and direction for properties where less is good', () => {
		const item = { total_refund: 50 };
		const previousItem = { total_refund: 100 };
		const delta = calculateDelta( item, previousItem, 'total_refund', 'day' );
		assert.equal( delta.value, -0.5 );
		assert.equal( delta.isIncreaseFavorable, false );
	} );
} );
