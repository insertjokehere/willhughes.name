var webpack = require('webpack');

if (process.env.NODE_ENV === "production") {
    var plugins = [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin()
    ]
} else {
    var plugins = []
}

module.exports = {
    context: __dirname,
    entry: "./assets/blackburn.js",
    output: {
        path: __dirname + "/static/",
        filename: "blackburn.js",
	publicPath: "/"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
	    { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?name=fonts/[hash].[ext]&limit=10000&minetype=application/font-woff" },
	    { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=fonts/[hash].[ext]" },
	    { test: /\.(png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=[hash].[ext]" }
        ]
    },
    plugins: plugins
};
