'use strict';

var fs = require('fs'),
	assert = require('assert'),
	createPermalinksStore = require('./../lib/permalinks-store');

it('should create permalink', function (cb) {		
	var permalinks = createPermalinksStore();
	var permalink = permalinks.create('/test/some', 'book', 'chapter');
	assert.equal(permalink, '/test/some');
	cb();	
});

it('should fallback to unique permalink', function (cb) {		
	var permalinks = createPermalinksStore();
	permalinks.create('/test/some', 'book1', 'chapter1');
	var permalink = permalinks.create('/test/some', 'book2', 'chapter2');
	assert.equal(permalink, '/book2/chapter2');
	cb();	
});

it('should unlink permalink', function (cb) {		
	var permalinks = createPermalinksStore();
	permalinks.create('/test/some', 'book1', 'chapter1');
	permalinks.unlink('/test/some');
	var permalink = permalinks.create('/test/some', 'book2', 'chapter2');
	assert.equal(permalink, '/test/some');
	cb();	
});
