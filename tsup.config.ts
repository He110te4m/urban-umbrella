import { defineConfig } from 'tsup'
import { globSync } from 'glob'
import { getExtensionByFormat } from '@he110/utils'
import AutoImport from 'unplugin-auto-import/esbuild'

export default defineConfig(() => {
  return {
    entry: globSync('src/headless/*/index.ts').map(p => p.replace(/[/\\]/g, '/')),
    format: ['esm', 'cjs', 'iife'],
    minify: false,
    splitting: true,
    clean: true,
    treeshake: true,
    dts: true,
    outDir: 'libs',
    platform: 'browser',
    noExternal: [
      'klona',
    ],
    outExtension({ format }) {
      return {
        js: getExtensionByFormat(format),
      }
    },
    esbuildPlugins: [
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
        ],
        dts: 'types/auto-import.d.ts',
      }),
    ],
  }
})
