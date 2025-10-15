import { BuildOptions } from 'esbuild'

export const commonConfig: BuildOptions = {
  minify: true,
  bundle: true,
  sourcemap: false,
  target: 'es2020',
  logLevel: 'info',
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}
