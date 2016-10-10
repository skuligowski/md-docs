var	marked = require('marked'),
	hljs = require('highlight.js'),
	renderer = new marked.Renderer();

var stripTagsRegexp = /<[^>]+>/gm;

module.exports = {
	render: function(content, bookmarks, resources) {	
		renderer.code = function(code, language) {
			var renderedCode = language ? hljs.highlight(language, code) : hljs.highlightAuto(code);
			return '<pre class="hljs ' + language + '"><code>' + renderedCode.value + '</code></pre>';
		};
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