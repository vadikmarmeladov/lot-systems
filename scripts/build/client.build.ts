import path from 'path'
import { build, Loader } from 'esbuild'
import gzipPlugin from '@luncheon/esbuild-plugin-gzip'
import config from '../../src/server/config'

async function buildClient() {
  try {
    console.log('📦 Building client bundles...')
    await build({
      entryPoints: [
        './src/client/entries/app.tsx',
        './src/client/entries/login.tsx',
        './src/client/entries/us.tsx',
        './src/client/entries/ui-lib.tsx',
      ],
      outdir: './dist/client/js',
      platform: 'browser',
      minify: true,
      bundle: true,
      write: false,  // Added this line
      sourcemap: false,
      target: 'es2020',
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.APP_HOST': JSON.stringify(process.env.APP_HOST || config.appHost),
        'process.env.APP_NAME': JSON.stringify(config.appName),
        'process.env.APP_DESCRIPTION': JSON.stringify(config.appDescription),
      },
      loader: { 
        '.js': 'jsx',
        '.tsx': 'tsx',
        '.ts': 'ts'
      } as { [key: string]: Loader },
      plugins: [
        gzipPlugin({
          uncompressed: true,
          gzip: true,
          brotli: false,
        })
      ]
    })
    console.log('✅ Client build completed')
  } catch (error) {
    console.error('❌ Client build failed:', error)
    process.exit(1)
  }
}

buildClient()