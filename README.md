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

