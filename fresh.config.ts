import { defineConfig } from '$fresh/server.ts'

import stylesPlugin from '@/plugins/styles.ts'

export default defineConfig({
  plugins: [stylesPlugin],
})
