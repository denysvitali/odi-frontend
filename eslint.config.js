import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  {
    name: 'app/rules',
    rules: {
      // Allow single-word component names in UI folder
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['Button', 'Card', 'Input', 'Badge', 'Tooltip', 'Skeleton', 'Sheet', 'Separator', 'Tabs']
        }
      ]
    }
  },
  skipFormatting
]
