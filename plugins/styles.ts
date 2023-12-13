import type { Plugin, PluginRenderStyleTag } from '$fresh/server.ts'
import { join } from '$std/path/join.ts'

const STYLES_DIR = './styles'

export default {
  name: 'styles',
  render: () => {
    const getStyle = (name: string): PluginRenderStyleTag => {
      const cssText = Deno.readTextFileSync(join(STYLES_DIR, name))
      return {
        cssText,
        id: name,
      }
    }

    const files = Deno.readDirSync(STYLES_DIR)
    const styles: PluginRenderStyleTag[] = []

    for (const file of files) {
      styles.push(getStyle(file.name))
    }

    return styles
  },
} as Plugin
