'use strict';

var fs = require('fs'),
	assert = require('assert'),
	bookshelf = require('./../lib/bookshelf');

it('should add chapter to the book', function (cb) {		
	var b = bookshelf();
	b.add('test/fixtures/source/test1.md');
	cb();	
});
