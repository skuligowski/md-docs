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

### Chapter yaml header options

- `book` - (type: `String`, required) - A name of a book to which the chapter belongs to.

- `chapter` - (type: `String`, required) - A name of the chapter.

- `permalink` - (type: `String`, optional) - Custom, friendly url for the chapter. By default the url is generated from the name of the book and chapter.

- `default` - (type: `Boolean`, optional) - When set to true, the chapter will be presented as first after entering the site.

- `order` - (type: `String`, optional) - This field is used to sort chapters in a book.

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

## Example

Providing that you have the following structure of your docs:

```
example
├── deployment
│   ├── config.md
│   ├── installation.md
│   ├── os.md
│   └── test.md
└── installation
    ├── faq.md
    ├── intro.md
    ├── requirements.ms
    └── steps.md
```

### Running documentation on local port 8001

```
$ cd example
$ md-docs --port 8001
Writing books.json
Using docs theme: default
Docs server listening on port 8001
```

### List all availables themes

```
$ cd example
$ md-docs --list-themes
dark (parent: default)
default
```

### Creating a custom theme which derives from 'dark'
```
$ cd example
$ mkdir my_theme
$ cd my_theme
$ md-docs --init-theme dark
Initializing theme using parents: dark,default
$ cd ..
$ md-docs --port 8001 --theme my_theme
Writing books.json
Using docs theme: my_theme
Docs server listening on port 8001
```

## Getting started with code

Install `md-docs` in your project.

```bash
npm install md-docs --save
```

To begin with a default configuration, provide only paths to source markdown files:

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

- `src` - (type: `Array|String`, defaults: `['\*\*/\*.md']`) - Glob patterns pointing to source markdown files that should be included in generated docs. 

- `options.port` - (type: `Integer`, default: `8000`) - A docs server port number.

- `options.theme` - (type: `String`, default: `'default'`) - An embedded theme name or a path to a custom theme. To list all available embedded themes use `md-docs --list-themes` command.

- `options.watch` - (type: `Boolean`, default: `false`) - Regenerates the documentaion where  markdown files are added, changed or deleted.

- `options.ignored` - (type: `Array|String|RegExp`, default: `/([\/\\]\.|node_modules)/`) - This is [anymatch](https://github.com/es128/anymatch)-compatible pattern. Defines files/paths that has to be ignored. The whole relative or absolute path is tested, not just filename.

- `options.debug` - (type: `Boolean`, default: `false`) - Verbosed output.

- `options.docsDestDir` - (type: 'String', default: os specific) - An intermediate directory to which the html content is generated from all found markdown files. If the `docsDestDir` option is not specified then html content is generaded to a os-specific temp directory and served from there. The temporary directory is cleared after `md-docs` process is terminated.

## Using with gulp

The `md-docs` server can be started using gulp task. 

```javascript
var gulp = require('gulp'),
    docs = require('md-docs');

gulp.task('default', function() {
    docs.start('./**/*.md');
});
```
