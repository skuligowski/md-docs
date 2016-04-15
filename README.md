md-docs
=======
Markdown docs generator

### Features

* book like structure
* continous watching of markdown files
* absolute/relative images inside the document
* permanent urls for chapters
* any possible structure of source files

## Getting Started

This short tutorial will walk you through the easiest way of starting to play with the documentation. 

To begin with the default configuration, you should point out source markdown files:

```javascript
var docs = require('md-docs');
docs.start('src/**/*.md');
```

Each markdown file should start with **the yaml header**. Provide the name of the book to which the markdown file belongs and the name of the chapter.

```yaml
---
book: Installation procedures
chapter: Configuration
---
```

Markdown files that don't have book and chapter properties in the header are not included in the book but they are still observed by the watcher.

After running the script the documentation site is available on: `http://localhost:8000`


