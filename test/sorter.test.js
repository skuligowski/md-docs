'use strict';

var assert = require('assert'),
	sorter = require('./../lib/sorter');

it('getSortString 1', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({}), '');
	cb();	
});

it('getSortString 2', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: 0}), '0');
	cb();	
});

it('getSortString 3', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: 's'}), 's');
	cb();	
});

it('getSortString 4', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: 'a', order: 'b'}), 'ba');
	cb();	
});

it('getSortString 5', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: 'a', order: 0}), '0a');
	cb();	
});

it('getSortString 6', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: 'a', order: null}), 'a');
	cb();	
});

it('getSortString 7', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: null, order: null}), '');
	cb();	
});

it('getSortString 8', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: null, order: undefined}), '');
	cb();	
});

it('getSortString 9', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: undefined, order: null}), '');
	cb();	
});

it('getSortString 10', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: undefined, order: undefined}), '');
	cb();	
});

it('getSortString 11', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: undefined, order: ''}), '');
	cb();	
});

it('getSortString 12', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: '', order: undefined}), '');
	cb();	
});

it('getSortString 13', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: null, order: ''}), '');
	cb();	
});

it('getSortString 14', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: '', order: null}), '');
	cb();	
});

it('getSortString 15', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: '', order: ''}), '');
	cb();	
});

it('getSortString 16', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: 1, order: 0}), '01');
	cb();	
});

it('getSortString 17', function (cb) {
	var getSortString = sorter('order', 'title').getSortString;
	assert.equal(getSortString({title: 1, order: undefined}), '1');
	cb();	
});


it('sortFn 1', function (cb) {
	var sorterFn = sorter('order', 'title');
	assert.equal(sorterFn({title: 'a'}, {title: 'b'}), -1);
	cb();	
});

it('sortFn 2', function (cb) {
	var sorterFn = sorter('order', 'title');
	assert.equal(sorterFn({title: 'b'}, {title: 'a'}), 1);
	cb();	
});

it('sortFn 3', function (cb) {
	var sorterFn = sorter('order', 'title');
	assert.equal(sorterFn({title: 'b'}, {title: 'b'}), 0);
	cb();	
});

it('sortFn 4', function (cb) {
	var sorterFn = sorter('order', 'title');
	assert.equal(sorterFn({title: 'a', order: 'b'}, {title: 'b'}), 1);
	cb();	
});

it('sortFn 4', function (cb) {
	var sorterFn = sorter('order', 'title');
	assert.equal(sorterFn({title: 'a', order: 'b'}, {title: 'b', order: 'c'}), -1);
	cb();	
});

it('sortFn 5', function (cb) {
	var sorterFn = sorter('order', 'title');
	assert.equal(sorterFn({title: 'a', order: 'b'}, {title: 'b', order: 'b'}), -1);
	cb();	
});

it('sortFn 5', function (cb) {
	var sorterFn = sorter('order', 'title');
	assert.equal(sorterFn({title: 'b', order: 'b'}, {title: 'b', order: 'b'}), 0);
	cb();	
});

