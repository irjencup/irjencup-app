var webpack = require('webpack')

module.exports = {

    entry: [
        // 'webpack-dev-server/client?http://localhost:2017',
        // 'webpack/hot/only-dev-server',
        './src/main.js'
    ],

    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist',
        publicPath: 'http://localhost:2017/static'
    },

    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
         'process.env': {
             // This has effect on the react lib size
             'NODE_ENV': JSON.stringify('production'),
         }
      }),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: false
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin()
    ],

    module: {
        loaders: [
            {
                test: /\.js$/ ,
                exclude: /node_modules/,
                loaders: ['babel?presets[]=es2015,presets[]=react']
            },
            {
              test: /\.jsx$/ ,
              exclude: /node_modules/,
              loaders: ['babel?presets[]=es2015,presets[]=react']
            },
            {
              test: /\.css$/,
              loader: 'style!css'
            },
            {
              test: /\.json$/,
              loaders: ['json']
            }
        ]
    }

}
