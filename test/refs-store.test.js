'use strict';

const assert = require('assert');
const createRefsStore = require('./../lib/refs-store');

it('should return slugged title', cb => {
	const uniqueRefs = createRefsStore();
	const ref = uniqueRefs.create('The test');
	assert.strictEqual('the-test', ref);
	cb();
});

it('should generate next uniqe ref id', cb => {
	const uniqueRefs = createRefsStore();
	
	uniqueRefs.nextUnique('The test');
	uniqueRefs.nextUnique('The test');
	uniqueRefs.nextUnique('The test');
	const ref = uniqueRefs.nextUnique('The test');
	assert.strictEqual('the-test-4', ref);
	cb();
});

it('should alow same refs for different namespaces', cb => {
	const uniqueRefs = createRefsStore();
	
	const refA = uniqueRefs.nextUnique('The test', 'a');
	const refB = uniqueRefs.nextUnique('The test', 'b');
	assert.strictEqual(refA, refB);
	cb();
});

it('should generate next unique refs for different namespaces', cb => {
	const uniqueRefs = createRefsStore();
	
	uniqueRefs.nextUnique('The first phrase', 'a');
	const refA = uniqueRefs.nextUnique('The first phrase', 'a');
	uniqueRefs.nextUnique('The second phrase', 'b');
	const refB = uniqueRefs.nextUnique('The second phrase', 'b');
	
	assert.strictEqual('the-first-phrase-2', refA);
	assert.strictEqual('the-second-phrase-2', refB);
	cb();
});

it('should return undefined when unique exists', cb => {
	const uniqueRefs = createRefsStore();
	
	const refA = uniqueRefs.unique('The test', 'a');
	const refB = uniqueRefs.unique('The test', 'a');
	assert.strictEqual(refB, undefined);
	cb();	
});

it('should return unique after unlinking', cb => {
	const uniqueRefs = createRefsStore();
	
	const refA = uniqueRefs.unique('The test', 'a');
	uniqueRefs.unlinkRef('the-test', 'a');
	const refB = uniqueRefs.unique('The test', 'a');
	assert.strictEqual(refB, 'the-test');
	cb();	
});
