let { some, includes } = require('lodash')
let { extname } = require('path')
let minimatch = require('minimatch')
let fs = require('fs')
let chalk = require('chalk')

function ContentReplaceWebpackPlugin (options) {
    this.replacer = options.rules || {}
    this.ignore = options.ignore || []
    this.external = options.external || []
}

function ignoreMatch (ignores, path) {
    return some(ignores, v => minimatch(path, v))
}

ContentReplaceWebpackPlugin.prototype.apply = function (compiler) {
    let replacer = this.replacer
    let ignores = this.ignore
    let externals = this.external
    compiler.plugin('after-emit', function (compilation, callback) {
        if (externals.length) {
            externals.forEach(external => {
                let ext = extname(external)
                let result = ''
                try {
                    result = fs.readFileSync(external,'utf8')
                } catch (e) {
                    console.log(chalk.red('ContentReplaceWebpackPlugin read ' + external + ' failed'))
                    return
                }
                if (includes(Object.keys(replacer), ext) && typeof replacer[ext] === 'function') {
                    result = replacer[ext](result)
                }
                try {
                    fs.writeFileSync(external, result, 'utf8')
                } catch (e) {
                    console.log(chalk.red('ContentReplaceWebpackPlugin write ' + external + ' failed'))
                }
            })
        }
        callback()
    })
    compiler.plugin('emit', function (compilation, callback) {
        let assets = compilation.assets
        Object.keys(assets).forEach(function (key) {
            if (ignoreMatch(ignores, key)) return
            let asset = compilation.assets[key]
            let content = asset.source()
            let result = content
            let ext = extname(key)
            if (includes(Object.keys(replacer), ext) && typeof replacer[ext] === 'function') {
                result = replacer[ext](content)
            }
            compilation.assets[key] = {
                source () {
                    return result
                },
                size () {
                    return content.length
                }
            }
        })
        callback()
    })
}

module.exports = ContentReplaceWebpackPlugin