var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var autoprefixer = require('autoprefixer');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //压缩css
//动态添加入口
function getEntry(){
    var entry = {};
    //读取src目录所有page入口
    glob.sync('./src/js/**/*.js').forEach(function(name){
        var start = name.indexOf('src/') + 4;
        var end = name.length - 3;
        var eArr = [];
        var n = name.slice(start,end);
        n= n.split('/')[1];
        eArr.push(name);
        eArr.push('babel-polyfill');
        entry[n] = eArr;
    })
    return entry;
}
//动态加时间戳
function stamp(){
    var date = new Date();
    date = Date.parse(date);
    return date;
}
//动态生成html
//获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name,chunks){
    return {
        template:`./src/pages/${name}.html`,
        filename:`pages/${name}.html`,
        inject:true,
        hash:false,
        chunks:[name]
    }
}
module.exports = {
    entry:getEntry(),
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:`js/[name]-${stamp()}-bundle.js`,
	    publicPath: "../"
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/(node_modules)/,
                include: /src/,
                use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets:['@babel/preset-env',],
                            plugins:['@babel/transform-runtime']
                        }
                    }
                ]
            },
            {
                test:/\.css$/,
                //use:['style-loader','css-loader','postcss-loader']//css不分离写法
                //css分离写法
                use:[MiniCssExtractPlugin.loader,"css-loader",{
                    loader: "postcss-loader",
	                options: {
		                ident: "postcss",
		                sourceMap: true,
		                plugins: loader => [
			                require('autoprefixer')(),
			                // 这里可以使用更多配置，如上面提到的 postcss-cssnext 等
			                // require('postcss-cssnext')()
		                ]
	                }
                }]
            },
            {
                test:/\.scss$/,
                //use:['style-loader','css-loader','sass-loader','postcss-loader']//css不分离写法
                //css分离写法
                use:[MiniCssExtractPlugin.loader,"css-loader",{
                    loader: "postcss-loader",
                      options: {
                        ident: "postcss",
                        sourceMap: true,
                        plugins: loader => [
                          require('autoprefixer')(),
                          // 这里可以使用更多配置，如上面提到的 postcss-cssnext 等
                          // require('postcss-cssnext')()
                        ]
                      }
                },"sass-loader"]
            },
	        {
		        test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
		        loader: 'file-loader',
		        options: {
			        name: 'source/[name].[ext]?[hash]' //该参数是打包后的文件名
		        }
	        }
        ]
    },
    mode:"production",
    performance:{
        hints:false
    },
    //插件
    plugins:[
        new MiniCssExtractPlugin({
            filename: `css/[name]-${stamp()}.css`
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery",
            "window.jQuery": "jquery"
        }),
        new TransferWebpackPlugin([
            {
                from: 'assets',
                to: 'assets'
            }
        ], path.resolve(__dirname,"src")),
	      new CleanWebpackPlugin(),
	    new OptimizeCssAssetsPlugin({})
    ]
}
//配置页面
var entryObj = getEntry();
var htmlArray = [];
Object.keys(entryObj).forEach(function(element){
    htmlArray.push({
        _html:element,
        title:'',
        chunks:[element]
    })
})
//自动生成html模板
htmlArray.forEach(function(element){
    module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html,element.chunks)));
})
