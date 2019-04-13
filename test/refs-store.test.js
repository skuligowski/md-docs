'use strict';

const assert = require('assert');
const createRefsStore = require('./../lib/refs-store');

it('should return slugged title', function (cb) {		
	const uniqueRefs = createRefsStore();
	const ref = uniqueRefs.create('The test');
	assert.equal('the-test', ref);
	cb();
});

it('should generate next uniqe ref id', function (cb) {		
	const uniqueRefs = createRefsStore();
	
	uniqueRefs.nextUnique('The test');
	uniqueRefs.nextUnique('The test');
	uniqueRefs.nextUnique('The test');
	const ref = uniqueRefs.nextUnique('The test');
	assert.equal('the-test-4', ref);
	cb();
});

it('should alow same refs for different namespaces', function (cb) {		
	const uniqueRefs = createRefsStore();
	
	const refA = uniqueRefs.nextUnique('The test', 'a');
	const refB = uniqueRefs.nextUnique('The test', 'b');
	assert.equal(refA, refB);
	cb();
});

it('should generate next unique refs for different namespaces', function (cb) {		
	const uniqueRefs = createRefsStore();
	
	uniqueRefs.nextUnique('The first phrase', 'a');
	const refA = uniqueRefs.nextUnique('The first phrase', 'a');
	uniqueRefs.nextUnique('The second phrase', 'b');
	const refB = uniqueRefs.nextUnique('The second phrase', 'b');
	
	assert.equal('the-first-phrase-2', refA);
	assert.equal('the-second-phrase-2', refB);
	cb();
});

it('should return undefined when unique exists', function (cb) {		
	const uniqueRefs = createRefsStore();
	
	const refA = uniqueRefs.unique('The test', 'a');
	const refB = uniqueRefs.unique('The test', 'a');
	assert.equal(refB, undefined);
	cb();	
});

it('should return unique after unlinking', function (cb) {		
	const uniqueRefs = createRefsStore();
	
	const refA = uniqueRefs.unique('The test', 'a');
	uniqueRefs.unlinkRef('the-test', 'a');
	const refB = uniqueRefs.unique('The test', 'a');
	assert.equal(refB, 'the-test');
	cb();	
});
