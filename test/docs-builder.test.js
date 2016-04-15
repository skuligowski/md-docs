'use strict';

var fs = require('fs'),
	assert = require('assert'),
	docs = require('./../lib/docs-builder');

it('should find all files', function (cb) {		
	docs.build('test/**/*.md', 'test/fixtures/rendered', {watch: false}, cb);
});
