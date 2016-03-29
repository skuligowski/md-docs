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
	
	uniqueRefs.unique('The test');
	uniqueRefs.unique('The test');
	uniqueRefs.unique('The test');
	var ref = uniqueRefs.unique('The test');
	assert.equal('the-test-3', ref);
	cb();	
});

it('should alow same refs for different namespaces', function (cb) {		
	var uniqueRefs = createRefsStore();
	
	var refA = uniqueRefs.unique('The test', 'a');
	var refB = uniqueRefs.unique('The test', 'b');
	assert.equal(refA, refB);
	cb();	
});

it('should generate next unique refs for different namespaces', function (cb) {		
	var uniqueRefs = createRefsStore();
	
	uniqueRefs.unique('The first phrase', 'a');
	var refA = uniqueRefs.unique('The first phrase', 'a');
	uniqueRefs.unique('The second phrase', 'b');
	var refB = uniqueRefs.unique('The second phrase', 'b');
	
	assert.equal('the-first-phrase-1', refA);
	assert.equal('the-second-phrase-1', refB);
	cb();	
});
