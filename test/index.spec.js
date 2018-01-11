let webpack = require('webpack')
let path = require('path')
let fs = require('fs')
let expect = require('chai').expect
let ContentReplacePlugin = require('../')

const OUTPUT_PATH = path.join(__dirname, "fixtures", "dist")

describe('Inject Html Plugin', () => {
    it('should inject html file correctly', done => {
        let compiler = webpack({
            entry: {
                main: path.join(__dirname, 'fixtures', 'entry.js')
            },
            output: {
                path: OUTPUT_PATH,
                filename: "[name].min.js"
            },
            plugins: [
                new ContentReplacePlugin({
                  rules: {
                    '.js': content => content.replace('world', 'foobar')
                  }
                })
            ]
        }, (err, stats) => {
            expect(err).to.equal(null)
            let html = fs.readFileSync(path.join(OUTPUT_PATH,'main.min.js'), 'utf8')
            let index = html.indexOf('hello foobar')
            expect(index).to.be.above(0)
            done()
        })
    })
})