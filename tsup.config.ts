import { defineConfig } from 'tsup'
import { globSync } from 'glob'
import { getExtensionByFormat } from '@he110/utils'

export default defineConfig(() => {
  return {
    entry: globSync('src/index.ts'), // globSync('src/*/index.ts').concat(globSync('src/index.ts')),
    format: ['esm', 'cjs'],
    minify: true,
    splitting: true,
    clean: true,
    treeshake: true,
    sourcemap: true,
    dts: true,
    outDir: 'libs',
    noExternal: [
    ],
    outExtension({ format }) {
      return {
        js: getExtensionByFormat(format),
      }
    },
  }
})
