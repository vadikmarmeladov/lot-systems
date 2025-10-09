const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

require('esbuild').build({
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
    '#server': './src/server',
    '#shared': './src/shared'
  }
}).catch(() => process.exit(1));
