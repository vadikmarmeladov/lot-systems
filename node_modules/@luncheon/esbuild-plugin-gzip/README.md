# esbuild-plugin-gzip

Gzip and Brotli compression for [esbuild](https://esbuild.github.io/).

## Installation

```sh
$ npm i -D esbuild @luncheon/esbuild-plugin-gzip
```

## Usage Example

```js
const esbuild = require('esbuild')
const gzipPlugin = require('@luncheon/esbuild-plugin-gzip')

esbuild.build({
  entryPoints: ['src/app.ts'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  write: false, // write must be false
  plugins: [gzipPlugin()],
})
```

## Options

```js
gzipPlugin({
  uncompressed: true,
  gzip: true,
  brotli: true,
  onEnd: ({ outputFiles }) => {
    // outputFiles.forEach(({ path, contents }) => {})
  }
})
```

## License

[WTFPL](http://www.wtfpl.net/)
