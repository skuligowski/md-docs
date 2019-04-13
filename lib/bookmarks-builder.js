const createRefsStore = require('./refs-store');

module.exports = function() {
    const bookmarks = [];
    const refsStore = createRefsStore();

    return {
        add: (text, level) => {
            const bookmarkRef = refsStore.nextUnique(text);
            let levelBookmarks = bookmarks[level];

            if (!levelBookmarks) {
                levelBookmarks = bookmarks[level] = [];
            }

            levelBookmarks.push({
            	title: text,
            	ref: bookmarkRef
            });

            return bookmarkRef;
        },
        get: () => {
            for (let i = 0; i < bookmarks.length; i++) {
                if (bookmarks[i] && bookmarks[i].length > 1) {
                    return bookmarks[i];
                }
            }
            return [];
        }
    };
};
