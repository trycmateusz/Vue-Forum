import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer'
import path from 'path'

const env = loadEnv(
  'mock', 
  process.cwd(),
  '' 
)
const processEnvValues = {
  'process.env': Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      }
    },
    {},
  )
}

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
  define: processEnvValues,
	plugins: [
    vue(),
    bundleAnalyzer()
  ],
})
