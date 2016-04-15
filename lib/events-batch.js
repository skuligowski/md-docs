module.exports = function batch(watcher, cb) {

	var timeout = null,
		events = emptyEvents();

	function emptyEvents() {
		return {
			unlinked: [],
			added: [],
			changed: []
		};
	}

	function flush() {
		var eventsToSend = events;
		events = emptyEvents();
		timeout = null;
		cb(eventsToSend.added, eventsToSend.changed, eventsToSend.unlinked);
	}

	function setFlushTimeout() {
		timeout = setTimeout(flush, 100);
	}

	function createAggregateFn(type) {
		return function(path) {
			if (!timeout) {
				setFlushTimeout();
			}
			events[type].push(path);
		};
	}

	watcher.on('add', createAggregateFn('added'));
	watcher.on('change', createAggregateFn('changed'));
	watcher.on('unlink', createAggregateFn('unlinked'));
};