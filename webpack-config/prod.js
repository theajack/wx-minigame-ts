const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: path.resolve('./', 'src/index.ts'),
    output: {
        path: path.resolve('./', 'dist'),
        filename: 'main.min.js',
        library: 'WXMiniGameTs',
        libraryTarget: 'umd',
        libraryExport: 'default',
        globalObject: 'this',
    },
    externals: {
    },
    module: {
        rules: [{
            test: /(.ts)$/,
            use: {
                loader: 'ts-loader'
            }
        }, {
            test: /(.js)$/,
            use: [{
                loader: 'babel-loader',
            }]
        }]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
};