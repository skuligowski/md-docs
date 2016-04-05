var	marked = require('marked'),
	highlight = require('highlight.js'),
	renderer = new marked.Renderer();

module.exports = {
	render: function(content, bookmarks, resources) {
		marked.setOptions({
			highlight: function (code) {
				return highlight.highlightAuto(code).value;
			}
		});
		renderer.heading = function(text, level) {
			var bookmarkRef = bookmarks.add(text, level);
			return '<h' + level + '><a name="' + bookmarkRef + '"></a>' + text + '</h' + level + '>';
		};
		var oldImageFn = marked.Renderer.prototype.image;
		renderer.image = function(href, title, text) {			
			return oldImageFn.call(this, resources.addImage(href), title, text);
		}
		return marked(content, { renderer: renderer });
	}
};