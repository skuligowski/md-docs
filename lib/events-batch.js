module.exports = (watcher, cb) => {

	let timeout = null;
	let events = emptyEvents();

	function emptyEvents() {
		return {
			unlinked: [],
			added: [],
			changed: []
		};
	}

	function flush() {
		const eventsToSend = events;
		events = emptyEvents();
		timeout = null;
		cb(eventsToSend.added, eventsToSend.changed, eventsToSend.unlinked);
	}

	function setFlushTimeout() {
		timeout = setTimeout(flush, 100);
	}

	function createAggregateFn(type) {
		return path => {
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
