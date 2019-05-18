'use strict';

var assert = require('assert'),
	sorter = require('./../lib/sorter');

it('getSortString 1', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({}), '');
	cb();	
});

it('getSortString 2', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: 0}), '0');
	cb();	
});

it('getSortString 3', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: 's'}), 's');
	cb();	
});

it('getSortString 4', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: 'a', order: 'b'}), 'ba');
	cb();	
});

it('getSortString 5', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: 'a', order: 0}), '0a');
	cb();	
});

it('getSortString 6', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: 'a', order: null}), 'a');
	cb();	
});

it('getSortString 7', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: null, order: null}), '');
	cb();	
});

it('getSortString 8', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: null, order: undefined}), '');
	cb();	
});

it('getSortString 9', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: undefined, order: null}), '');
	cb();	
});

it('getSortString 10', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: undefined, order: undefined}), '');
	cb();	
});

it('getSortString 11', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: undefined, order: ''}), '');
	cb();	
});

it('getSortString 12', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: '', order: undefined}), '');
	cb();	
});

it('getSortString 13', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: null, order: ''}), '');
	cb();	
});

it('getSortString 14', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: '', order: null}), '');
	cb();	
});

it('getSortString 15', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: '', order: ''}), '');
	cb();	
});

it('getSortString 16', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: 1, order: 0}), '01');
	cb();	
});

it('getSortString 17', cb => {
	var getSortString = sorter('order', 'title').getSortString;
	assert.strictEqual(getSortString({title: 1, order: undefined}), '1');
	cb();	
});


it('sortFn 1', cb => {
	var sorterFn = sorter('order', 'title');
	assert.strictEqual(sorterFn({title: 'a'}, {title: 'b'}), -1);
	cb();	
});

it('sortFn 2', cb => {
	var sorterFn = sorter('order', 'title');
	assert.strictEqual(sorterFn({title: 'b'}, {title: 'a'}), 1);
	cb();	
});

it('sortFn 3', cb => {
	var sorterFn = sorter('order', 'title');
	assert.strictEqual(sorterFn({title: 'b'}, {title: 'b'}), 0);
	cb();	
});

it('sortFn 4', cb => {
	var sorterFn = sorter('order', 'title');
	assert.strictEqual(sorterFn({title: 'a', order: 'b'}, {title: 'b'}), 1);
	cb();	
});

it('sortFn 4', cb => {
	var sorterFn = sorter('order', 'title');
	assert.strictEqual(sorterFn({title: 'a', order: 'b'}, {title: 'b', order: 'c'}), -1);
	cb();	
});

it('sortFn 5', cb => {
	var sorterFn = sorter('order', 'title');
	assert.strictEqual(sorterFn({title: 'a', order: 'b'}, {title: 'b', order: 'b'}), -1);
	cb();	
});

it('sortFn 5', cb => {
	var sorterFn = sorter('order', 'title');
	assert.strictEqual(sorterFn({title: 'b', order: 'b'}, {title: 'b', order: 'b'}), 0);
	cb();	
});
