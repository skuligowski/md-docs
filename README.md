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

This short tutorial will walk you through the easiest way of starting to play with `md-docs`. 

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

## API

`docs.start(paths, [options])`

### paths

Type: `Array|String`

Paths to files, or glob patterns that contain markdown content with valid the**yaml header**.

### options.port

Type: `Integer`
Default: `8000`

The docs server port number.

### options.watch

Type: `Boolean`
Default: `false`

If set to `true`, updates generated docs whenever watched file patterns (`paths` property) are added, changed or deleted.

### options.ignored

Type: `Array|String|RegExp`
Default: `/([\/\\]\.|node_modules)/`

This is [anymatch](https://github.com/es128/anymatch)-compatible definition. Defines files/paths to be ignored. The whole relative or absolute path is tested, not just filename.

### options.cwd

Type: `String`
Default: no default

The base directory from which paths to markdown files are to be derived.