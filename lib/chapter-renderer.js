var	marked = require('marked'),
	highlight = require('highlight.js'),
	renderer = new marked.Renderer();

var stripTagsRegexp = /<[^>]+>/gm;

module.exports = {
	render: function(content, bookmarks, resources) {
		marked.setOptions({
			highlight: function (code, language) {
				if (language) {
					return highlight.highlight(language, code).value;	
				} else {
					return highlight.highlightAuto(code).value;
				}
			}
		});
		renderer.heading = function(text, level) {
			var bookmarkRef = bookmarks.add(text.replace(stripTagsRegexp, ''), level);
			return '<h' + level + '><a name="' + bookmarkRef + '"></a>' + text + '</h' + level + '>';
		};
		var oldImageFn = marked.Renderer.prototype.image;
		renderer.image = function(href, title, text) {			
			return oldImageFn.call(this, resources.addImage(href), title, text);
		}
		return marked(content, { renderer: renderer });
	}
};