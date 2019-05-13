module.exports = (...fields) => {
	function getSortString(meta) {
		let s = '';
		for (let i = 0; i < fields.length; i++) {
			let field = fields[i];
			if (meta[field] !== undefined && meta[field] !== null) 
				s += meta[field];
		}
		return s;
	}
	const sorterFn = function(a, b) {
		return getSortString(a).localeCompare(getSortString(b));
	};
	sorterFn.getSortString = getSortString;
	return sorterFn;
};
