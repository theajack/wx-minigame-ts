const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    watch: true,
    devtool: 'cheap-source-map',
    mode: 'development',
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
        }, {
            test: /(.js)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            exclude: /node_modules/,
            options: {
                configFile: './.eslintrc.js'
            }
        }]
    },
    plugins: [
        new ProgressBarPlugin(),
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
};