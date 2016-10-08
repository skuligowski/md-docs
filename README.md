md-docs [![Build Status](https://travis-ci.org/skuligowski/md-docs.svg?branch=master)](https://travis-ci.org/skuligowski/md-docs)
=======
Markdown docs generator

## Installation

`md-docs` can be installed both globally and locally. 

```bash
npm install md-docs -g
```

## Docs structure

The documentation is a collection of **books**. Each book has a unique title and contains several **chapters**. Each chapter should be written in a separate markdown file.

Each markdown file should start with a **yaml header**. Provide a name of a book to which the markdown file belongs to and a name of a chapter.

```yaml
---
book: Installation procedures
chapter: Configuration
---
```

Markdown files that don't have the book and the chapter properties in the header are not included in the documentation.

## Usage

```
md-docs [--help] [--src SRC1[,SRC2]] [--port PORT] [--theme THEME] 
        [--ignored REGEXP] [--list-themes] [--init-theme [PARENT_THEME]] [--debug] [--watch]

optional arguments:
    --help                  Show this help message and exit.
    --src SRC1[,SRC2]       Glob patterns pointing to source markdown files
                            that should be included in generated docs. Defaults: **/*.md
    --port PORT             Port that will be used to serve the documentation 
                            on the web. Defaults: 8000
    --theme THEME           An embedded theme name or a path to a custom theme.
                            Defaults: default
    --watch                 Watches markdown files for changes.
    --ignore REGEXP         Defines files/paths to be ignored when watching. 
                            The whole relative or absolute path is tested, not just filename. 
                            Defaults: /([\/\\]\.|node_modules)/
    --list-themes           Lists all embedded themes.
    --init-theme [PARENT_THEME]
                            Initializes a new theme in a current directory. 
                            The new theme may derive content from any embedded
                            theme. Defaults: 'default'.
    --debug                 More verbosed output.
```

## Getting started with code

Install `md-docs` in your project.

```bash
npm install md-docs --save
```

To begin with the default configuration, provide only paths to source markdown files:

```javascript
var docs = require('md-docs');
docs.start('docs/**/*.md');
```


## Public API

### docs.start(src, [options])

Runs docs generated from `src` markdown files.

Example with all default options:

```javascript
docs.start(['**/*.md'], {
    port: 8000,
    theme: 'default',
    watch: false,
    ignored: /([\/\\]\.|node_modules)/,
    docsDestDir: '/var/temp/asqqwe', // default value depends on the os 
    debug: false
});
```

- `src` - (type: `Array|String`, defaults: ['\*\*/\*.md']) - Paths to files, or glob patterns that contain the markdown content with the valid **yaml header**

- `options.port` - (type: `Integer`, default: 8000) - The docs server port number

- `options.watch` - (type: `Boolean`, default: false) - If set to `true`, updates generated docs whenever watched file patterns (`paths` property) are added, changed or deleted.

- `options.ignored` - (type: `Array|String|RegExp`, default: `/([\/\\]\.|node_modules)/`) - This is [anymatch](https://github.com/es128/anymatch)-compatible definition. Defines files/paths to be ignored. The whole relative or absolute path is tested, not just filename.

- `options.debug` - (type: `Boolean`, default: `false`) - If set to `true` more information about building process is available at the console output.

- `options.docsDestDir` - (type: 'String', default: no default) - Intermediate directory to which the html content is generated from all found markdown files. The structure of the that directory is based on *yaml headers* of each markdown file.

If the `docsDestDir` option is not specified then the html content is generaded to a system-specific temp directory and served from there. The temporary directory is cleared after the md-docs process is terminated.

## Using with gulp

The `md-docs` server can be started using gulp task. 

```javascript
var gulp = require('gulp'),
    docs = require('md-docs');

gulp.task('default', function() {
    docs.start('./**/*.md');
});
```
