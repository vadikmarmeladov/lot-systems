const path = require('path');
const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

build({
  entryPoints: ['./src/server/server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node14',
  format: 'cjs',
  outfile: 'dist/server.js',
  plugins: [nodeExternalsPlugin()],
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`,
  },
  external: ['./node_modules/*'],
  alias: {
    '#server': path.resolve(__dirname, './src/server'),
    '#shared': path.resolve(__dirname, './src'),
    '#client': path.resolve(__dirname, './src/client')
  },
  resolveExtensions: ['.ts', '.js', '.json'],
  sourcemap: true
}).catch(() => process.exit(1));
