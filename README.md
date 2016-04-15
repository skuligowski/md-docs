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

This short tutorial will walk you through the easiest way of starting to play with documentation. 

To begin with the default configuration, you should point out source markdown files:

```javascript
var docs = require('md-docs');
docs.start('src/**/*.md');
```

Each markdown file should start with *the yaml header*. The minimum required set of properties is the name of the book to which the markdown file belongs to and the name of the chapter.

```yaml
---
book: Installation procedures
chapter: Configuration
---
```

Markdown files that don't have book and chapter properties in the header are omitted.
