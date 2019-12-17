const path = require('path');
const merge = require('webpack-merge');
const common =require('./webpack.common.js')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


let devConfig = {
	mode: 'development',
	output: {
		filename: 'main.[hash].js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {

		rules: [
			{
				test: /\.(sc|c|sa)ss$/,
				use: [
					'style-loader',
					{
						loader:"css-loader",
						options:{ sourceMap: true }
					},
					{
						loader:"postcss-loader",
						options: {
							ident: "postcss",
							sourceMap: true,
							plugins: loader => [
								require('autoprefixer')(),
								// 这里可以使用更多配置，如上面提到的 postcss-cssnext 等
								// require('postcss-cssnext')()
							]
						}
					},
					{
						loader:"sass-loader",
						options:{ sourceMap: true }
					},
				]
			}
		],
	},
	devtool: 'inline-source-map',
	devServer:{
		contentBase:path.join(__dirname, 'dist'),
		compress: true,
		hot: true,
		overlay: true,
		open: true,
		publicPath: '/',
		host: 'localhost',
		port: '1200',
		// 请求代理  最后当我们请求 /api/getuser 接口，就会转发到 http://192.168.30.33:8080/mock/api。
		proxy: {
			"/api": { // 以 '/api' 开头的请求，会跳转到下面的 target 配置
				target: "http://192.168.30.33:8080",
				pathRewrite: {
					"^api": "/mock/api"
				}
			}
		},
	},

	plugins:[
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin() // 		new BundleAnalyzerPlugin() 分析表的不要了
	]
}
module.exports = merge(common, devConfig)

