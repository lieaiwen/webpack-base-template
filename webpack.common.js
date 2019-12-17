const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './src/index.html',
	resolve: {
	   alias: {
	    '@' : path.resolve(__dirname, 'src/')
	   },
		extensions: [".js", '.json']
	},
	module: {
		noParse: function(content){
			return /jquery|lodash/.test(content);
		},
		rules: [
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				include: [path.resolve(__dirname, 'src/')],
				use: [ 'file-loader' ]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				include: [path.resolve(__dirname, 'src/')],
				use: [
					{
						loader: 'url-loader', // 根据图片大小，把图片转换成 base64
						options: { limit: 10000 },
					},
				]
			},
			{
				test: /\.js$/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						cacheDirectory: true,
					}
				}],
				exclude: /(node_modules|bower_components)/,
			}

		],

	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "lie study!",   // 生成的文件标题
			filename: "main.html", // 最终生成的文件名
			minify: { // 压缩选项
				collapseWhitespace: false, // 移除空格
				removeComments: true, // 移除注释
				removeAttributeQuotes: true, // 移除双引号
			}
		}),
		new CleanWebpackPlugin()
	]
}

