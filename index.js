let {
  some,
  includes,
  forEach,
  isString,
  isFunction
} = require('lodash')
let { extname } = require('path')
let minimatch = require('minimatch')
let fs = require('fs')
let chalk = require('chalk')

function ContentReplacePlugin(options) {
  options.rules = options.rules || {}
  options.chunks = options.chunks || []
  options.external = options.external || []
  this.options = options
}

function isRuleMatched(file, rule) {
  if (isString(rule)) {
    return minimatch(file, rule)
  }
  return false
}

function applyReplacer(file, content, replacers) {
  let replaced = content
  forEach(replacers, (replacer, rule) => {
    if (isRuleMatched(file, rule) && isFunction(replacer)) {
      replaced = replacer(content)
      return false
    }
  })
  return replaced
}

ContentReplacePlugin.prototype.apply = function(compiler) {
  let options = this.options
  let replacer = options.rules
  let selected = options.chunks
  let externals = options.external
  let afterEmit = function(compilation, callback = () => {}) {
    if (externals.length) {
      externals.forEach(external => {
        let result = ''
        try {
          result = fs.readFileSync(external, 'utf8')
        } catch (e) {
          console.log(
            chalk.red('ContentReplacePlugin read ' + external + ' failed')
          )
          return
        }
        result = applyReplacer(external, result, replacer)
        try {
          fs.writeFileSync(external, result, 'utf8')
        } catch (e) {
          console.log(
            chalk.red('ContentReplacePlugin write ' + external + ' failed')
          )
        }
      })
    }
    callback()
  }
  let emit = function(compilation, callback = () => {}) {
    let assets = compilation.assets
    let files = []
    let chunks = compilation.chunks
    forEach(chunks, chunk => {
      if (selected.length > 0) {
        if (includes(selected, chunk.name)) {
          files = files.concat(chunk.files)
        }
      } else {
        files = files.concat(chunk.files)
      }
    })
    forEach(files, function(key) {
      let asset = compilation.assets[key]
      let content = asset.source()
      let result = applyReplacer(key, content, replacer)
      compilation.assets[key] = {
        source() {
          return result
        },
        size() {
          return result.length
        }
      }
    })
    callback()
  }

  if (compiler.hooks) {
    compiler.hooks.emit.tap('ContentReplacePlugin', emit)
    compiler.hooks.afterEmit.tap('ContentReplacePlugin', afterEmit)
  } else {
    compiler.plugin('emit', emit)
    compiler.plugin('after-emit', afterEmit)
  }
}

module.exports = ContentReplacePlugin
