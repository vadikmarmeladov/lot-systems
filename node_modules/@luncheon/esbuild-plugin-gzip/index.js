const fs = require('fs/promises')
const path = require('path')
const zlib = require('zlib')
const { promisify } = require('util')

const compressGz = promisify(zlib.gzip)
const compressBr = promisify(zlib.brotliCompress)

const write = async (path, contents) => {
  await fs.writeFile(path, contents)
  return { path, contents }
}
const writeGz = async (filename, contents) => await write(filename + '.gz', await compressGz(contents, { level: 9 }))
const writeBr = async (filename, contents) => await write(filename + '.br', await compressBr(contents))

const plugin = ({ uncompressed, gzip, brotli, onEnd } = {}) => ({
  name: 'esbuild-plugin-gzip',
  setup: build => {
    if (build.initialOptions.write !== false) {
      throw Error('`write` option of esbuild must be `false`')
    }
    build.onEnd(async result => {
      const outputFiles = await Promise.all(
        result.outputFiles.map(async ({ path: filename, contents }) => {
          await fs.mkdir(path.dirname(filename), { recursive: true })
          return Promise.all([
            uncompressed !== false ? write(filename, contents) : undefined,
            gzip !== false ? writeGz(filename, contents) : undefined,
            brotli !== false ? writeBr(filename, contents) : undefined,
          ])
        }),
      )
      onEnd?.({ outputFiles: outputFiles.flat().filter(Boolean) })
    })
  },
})

module.exports = plugin.default = plugin
