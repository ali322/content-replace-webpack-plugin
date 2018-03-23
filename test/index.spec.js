let webpack = require('webpack')
let path = require('path')
let fs = require('fs')
let rm = require('rimraf')
let expect = require('chai').expect
let ContentReplacePlugin = require('../')

const OUTPUT_PATH = path.join(__dirname, 'dist')

describe('Content Replace Plugin', () => {
  beforeEach(done => {
    rm('test/dist/*.*', done)
  })
  it('should replace content correctly', done => {
    let compiler = webpack(
      {
        entry: {
          main: path.join(__dirname, 'fixtures', 'entry.js'),
          other: path.join(__dirname, 'fixtures', 'other.js')
        },
        output: {
          path: OUTPUT_PATH,
          filename: '[name].min.js'
        },
        plugins: [
          new ContentReplacePlugin({
            chunks: ['main'],
            rules: {
              '*.js': content => content.replace('world', 'foobar233')
            }
          })
        ]
      },
      (err, stats) => {
        expect(err).to.equal(null)
        let html = fs.readFileSync(
          path.join(OUTPUT_PATH, 'main.min.js'),
          'utf8'
        )
        let index = html.indexOf('hello foobar')
        expect(index).to.be.above(0)
        done()
      }
    )
  })
})
