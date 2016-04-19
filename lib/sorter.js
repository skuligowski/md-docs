module.exports = function() {
	var fields = Array.prototype.slice.call(arguments);
	function getSortString(meta) {
		var s = '';
		for(var i = 0; i < fields.length; i++) {
			var field = fields[i];
			if (meta[field] !== undefined && meta[field] !== null) 
				s += meta[field];
		}
		return s;
	}
	var sorterFn = function(a, b) {
		return getSortString(a).localeCompare(getSortString(b));
	};
	sorterFn.getSortString = getSortString;
	return sorterFn;
};