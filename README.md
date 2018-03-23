content-replace-webpack-plugin [![Build Status](https://travis-ci.org/ali322/content-replace-webpack-plugin.svg?branch=master)](https://travis-ci.org/ali322/content-replace-webpack-plugin) [![npm version](https://badge.fury.io/js/content-replace-webpack-plugin.svg)](https://badge.fury.io/js/content-replace-webpack-plugin)
===
[![NPM](https://nodei.co/npm/content-replace-webpack-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/content-replace-webpack-plugin/)

simple and efficient plugin that replace assets content when webpack emit files

Install
===

```javascript
npm install content-replace-webpack-plugin --save--dev
```

Usage
===

add plugin in your webpack.config.js

```javascript
var ContentReplacePlugin = require('content-replace-webpack-plugin')

module.exports = {
    entry:{
        index:"./index.js"
    },
    module:{
        loaders:[
            ...
        ]
    },
    output:{
        path:'./dist',
        filename:'[name].min.js'
    },
    plugins:[
        new ContentReplacePlugin({
          external: ['path/to/other/file'], // other files which not in webpack assets
          chunks: ['index'],
          rules: {
            '.js': content => content.replace('/foo', '/bar')
          }
        })
    ]
}
```

Plugin Options
===

- **external**: other files which not in webpack assets
- **rules**: replace rules, accept object which key is file extname and value is replace function
- **chunks**: only these chunks's files will be replaced, default value is all

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)