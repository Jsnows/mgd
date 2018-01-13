module.exports = {
	// 配置入口（应用入口）
	app: [
		'index'
	],
	// 默认启动server打开的页面，只能设置一个，不设置则不打开
	defaultPage:'',
	// dll
	dll: [
		'./node_modules/vue/dist/vue.esm.js',
		'./node_modules/es6-promise/dist/es6-promise.auto.js',
		'vuex',
	],
	// 别名
	alias: {
		
	},
	// webpack loaders
	loaders: [

	],
	// 输出目录的名称
	outputName: './dist',
	// 是否压缩
	zip: true,
	// 是否启用热更新
	hot: false,
	// webpack打包分析
	analyzer: false,
}