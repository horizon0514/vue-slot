// vite.config.js
const path = require('path');
const { defineConfig } = require('vite');
const vueJsx = require('@vitejs/plugin-vue-jsx');

module.exports = defineConfig({
	// 项目根目录
	root: './packages/demo',
	// 静态资源目录，相对root路径
	publicDir: './static',
	plugins: [vueJsx(),]
})
