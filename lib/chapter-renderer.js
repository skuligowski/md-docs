const marked = require('marked');
const hljs = require('highlight.js');
const renderer = new marked.Renderer();

const stripTagsRegexp = /<[^>]+>/gm;

module.exports = {
	render: function(content, bookmarks, resources) {	
		renderer.code = function(code, language) {
			const renderedCode = language ? hljs.highlight(language, code) : hljs.highlightAuto(code);
			return `<pre class="hljs ${language}"><code>${renderedCode.value}</code></pre>`;
		};
		renderer.heading = function(text, level) {
			const bookmarkRef = bookmarks.add(text.replace(stripTagsRegexp, ''), level);
			return `<h${level}><a name="${bookmarkRef}"></a>${text}</h${level}>`;
		};
		const oldImageFn = marked.Renderer.prototype.image;
		renderer.image = function(href, title, text) {			
			return oldImageFn.call(this, resources.addImage(href), title, text);
		};
		return marked(content, { renderer });
	}
};
