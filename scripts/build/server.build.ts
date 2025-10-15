import { build, Loader } from 'esbuild'
import { commonConfig } from './build.config'

async function buildServer() {
  try {
    console.log('🔧 Building server...')
    await build({
      ...commonConfig,
      entryPoints: ['./src/server/index.ts'],
      platform: 'node',
      outfile: './dist/server/server/index.js',
      format: 'cjs',
      external: [
        'express',
        'pg',
        'dotenv'
      ],
      loader: {
        '.ts': 'ts',
        '.js': 'js'
      } as { [key: string]: Loader }
    })
    console.log('✅ Server build completed')
  } catch (error) {
    console.error('❌ Server build failed:', error)
    process.exit(1)
  }
}

buildServer()
