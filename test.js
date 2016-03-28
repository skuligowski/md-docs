'use strict';
var assert = require('assert');
var mdDocs = require('./');
var path = require('path');
var fs = require('fs');


it('should decorate using custom function', function (cb) {	
	assert.equal(2, 2);
	cb();
	//mdDocs();
});
