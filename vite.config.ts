import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Page from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import Inspect from 'vite-plugin-inspect'

const projectRootDir = __dirname

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '~/': `${resolve(projectRootDir, 'src')}/`,
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
    plugins: [
      vue(),

      // https://github.com/hannoeru/vite-plugin-pages
      Page({
        dirs: [
          { dir: 'src/**/demo', baseRoute: 'demo' },
        ],
        exclude: ['**/!(index).vue'],
        extensions: ['vue'],
        onRoutesGenerated(routes) {
          routes.forEach((route) => {
            route.path = route.component.slice(4, 0 - '/index.vue'.length)
            route.name = route.path
              .split(/[\\\/]/g)
              .map((dir: string) => dir.charAt(0).toUpperCase() + dir.slice(1))
              .join('')
          })

          return routes
        },
      }),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
        ],
        dts: 'types/auto-import.d.ts',
      }),

      Inspect(),
    ],
  }
})
