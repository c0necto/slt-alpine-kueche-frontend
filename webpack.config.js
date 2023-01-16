const webpack = require('webpack')

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            process: 'process/browser',
        }),
    ],
}