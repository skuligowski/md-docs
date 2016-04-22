md-docs [![Build Status](https://travis-ci.org/skuligowski/md-docs.svg?branch=master)](https://travis-ci.org/skuligowski/md-docs)
=======
Markdown docs generator

### Features

* book like structure
* continous watching of markdown files
* absolute/relative images inside the document
* permanent urls for chapters
* any possible structure of source files
* automatically generated bookmarks for the chapter

## Getting Started

This short tutorial will walk you through the easiest way of starting to play with `md-docs`. 

To begin with the default configuration, provide only paths to source markdown files:

```javascript
var docs = require('md-docs');
docs.start('src/**/*.md');
```

Each markdown file should start with the **yaml header**. Provide the name of the book to which the markdown file belongs and the name of the chapter.

```yaml
---
book: Installation procedures
chapter: Configuration
---
```

Markdown files that don't have the book and the chapter properties in the header are not included in the book but they are still observed by the watcher.

After running the script the documentation site is available on: `http://localhost:8000`

## Working with sources

The `md-docs` server can be started with the `watch` option enabled. It means that all paths to markdown files are watched continously for changes (addition, deletion or file update).

```javascript
var docs = require('md-docs');
docs.start('src/**/*.md' , {
    watch: true,
    port: 8001
});
```

## Using with gulp

The `md-docs` server can be started using gulp task. Check the example of `gulpfile.js`:

```javascript
var gulp = require('gulp'),
    docs = require('md-docs');

gulp.task('default', function() {
    docs.start('./**/*.md', { 
        port: 8001, 
        watch: true 
    });
});
```

## API

`docs.start(paths, [options])`

Scans all paths to files that contain markdown content, generates the html site and runs this site on the http server. 

### paths

Type: `Array|String`

Paths to files, or glob patterns that contain the markdown content with the valid **yaml header**.

### options

#### options.port

Type: `Integer`
Default: `8000`

The docs server port number.

#### options.watch

Type: `Boolean`
Default: `false`

If set to `true`, updates generated docs whenever watched file patterns (`paths` property) are added, changed or deleted.

#### options.ignored

Type: `Array|String|RegExp`
Default: `/([\/\\]\.|node_modules)/`

This is [anymatch](https://github.com/es128/anymatch)-compatible definition. Defines files/paths to be ignored. The whole relative or absolute path is tested, not just filename.

#### options.cwd

Type: `String`
Default: no default

The base directory from which paths to markdown files are to be derived.

#### options.debug

Type: `Boolean`
Default: `false`

If set to `true` more information about building process is available at the console output.

#### options.docsDestDir

Type: 'String'
Default: no default

Intermediate directory to which the html content is generated from all found markdown files. The structure of the that directory is based on *yaml headers* of each markdown file.

If the `docsDestDir` option is not specified then the html content is generaded to a system-specific temp directory and served from there. The temporary directory is cleared after the md-docs process is terminated.


