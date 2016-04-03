var	marked = require('marked'),
	highlight = require('highlight.js'),
	renderer = new marked.Renderer();

module.exports = {
	render: function(content, bookmarks) {
		marked.setOptions({
			highlight: function (code) {
				return highlight.highlightAuto(code).value;
			}
		});
		renderer.heading = function(text, level) {
			var bookmarkRef = bookmarks.add(text, level);
			return '<h' + level + '><a name="' + bookmarkRef + '"></a>' + text + '</h' + level + '>';
		};		
		return marked(content, { renderer: renderer });
	}
};