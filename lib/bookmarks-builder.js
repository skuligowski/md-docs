var	createRefsStore = require('./refs-store');

module.exports = function() {
    var bookmarks = [],
    	refsStore = createRefsStore();

    return {
        add: function(text, level) {
            var bookmarkRef = refsStore.nextUnique(text),
            	levelBookmarks = bookmarks[level];

            if (!levelBookmarks) {
                levelBookmarks = bookmarks[level] = [];
            }

            levelBookmarks.push({
            	title: text,
            	ref: bookmarkRef
            });

            return bookmarkRef;
        },
        get: function() {
            for (var i = 0; i < bookmarks.length; i++) {
                if (bookmarks[i] && bookmarks[i].length > 1) {
                    return bookmarks[i];
                }
            }
            return [];
        }
    };
};
