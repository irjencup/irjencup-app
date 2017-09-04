module.exports = {

    entry: [
        'webpack-dev-server/client?http://localhost:2017',
        'webpack/hot/only-dev-server',
        './src/main.js'
    ],

    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist',
        publicPath: 'http://localhost:2017/static'
    },

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
