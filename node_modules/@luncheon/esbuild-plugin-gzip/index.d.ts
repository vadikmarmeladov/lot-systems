import type { Plugin } from 'esbuild'

export interface CompressResult {
  outputFiles: {
    path: string
    contents: Buffer
  }[]
}

export interface Options {
  readonly uncompressed?: boolean
  readonly gzip?: boolean
  readonly brotli?: boolean
  onEnd?(result: CompressResult): void
}

declare const plugin: (options: Options) => Plugin

export default plugin

export = plugin
