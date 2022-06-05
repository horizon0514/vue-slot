// vite.config.js
const path = require('path');
const { defineConfig } = require('vite');
const vueJsx = require('@vitejs/plugin-vue-jsx');
const { viteStaticCopy } = require('vite-plugin-static-copy');
import typescript from 'vite-plugin-dts';

module.exports = defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'vue-slot',
				fileName: (format) => `vue-slot.${format}.js`
			},
			rollupOptions: {
				// 确保外部化处理那些你不想打包进库的依赖
				external: ['vue'],
				output: {
					// 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
					globals: {
						vue: 'Vue'
					}
				}
			}
	},
	// 项目根目录
	root: '.',
	plugins: [vueJsx(), typescript({
		tsconfig: './tsconfig.json',
		hook: {
			// Always rename declaration files to index.d.ts to avoid emitting two declaration files with identical contents
			outputPath: (path, kind) => {
				console.log(path, kind);
				return (kind === 'declaration' ? './dist/index.d.ts' : path)
			},
		},
	}),]
})
