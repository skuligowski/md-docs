'use strict';

var fs = require('fs'),
	assert = require('assert'),
	createRefsStore = require('./../lib/refs-store');

it('should return slugged title', function (cb) {		
	var uniqueRefs = createRefsStore(),
		ref = uniqueRefs.create('The test');
	assert.equal('the-test', ref);
	cb();	
});

it('should generate next uniqe ref id', function (cb) {		
	var uniqueRefs = createRefsStore();
	
	uniqueRefs.nextUnique('The test');
	uniqueRefs.nextUnique('The test');
	uniqueRefs.nextUnique('The test');
	var ref = uniqueRefs.nextUnique('The test');
	assert.equal('the-test-4', ref);
	cb();	
});

it('should alow same refs for different namespaces', function (cb) {		
	var uniqueRefs = createRefsStore();
	
	var refA = uniqueRefs.nextUnique('The test', 'a');
	var refB = uniqueRefs.nextUnique('The test', 'b');
	assert.equal(refA, refB);
	cb();	
});

it('should generate next unique refs for different namespaces', function (cb) {		
	var uniqueRefs = createRefsStore();
	
	uniqueRefs.nextUnique('The first phrase', 'a');
	var refA = uniqueRefs.nextUnique('The first phrase', 'a');
	uniqueRefs.nextUnique('The second phrase', 'b');
	var refB = uniqueRefs.nextUnique('The second phrase', 'b');
	
	assert.equal('the-first-phrase-2', refA);
	assert.equal('the-second-phrase-2', refB);
	cb();	
});

it('should return undefined when unique exists', function (cb) {		
	var uniqueRefs = createRefsStore();
	
	var refA = uniqueRefs.unique('The test', 'a');
	var refB = uniqueRefs.unique('The test', 'a');
	assert.equal(refB, undefined);
	cb();	
});

it('should return unique after unlinking', function (cb) {		
	var uniqueRefs = createRefsStore();
	
	var refA = uniqueRefs.unique('The test', 'a');
	uniqueRefs.unlinkRef('the-test', 'a');
	var refB = uniqueRefs.unique('The test', 'a');
	assert.equal(refB, 'the-test');
	cb();	
});