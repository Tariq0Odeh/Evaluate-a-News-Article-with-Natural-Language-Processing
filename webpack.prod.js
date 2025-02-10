const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                useShortDoctype: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: "styles.[contenthash].css",
        }),
        new WorkboxPlugin.GenerateSW({
            swDest: "service-worker.js",
            clientsClaim: true,
            skipWaiting: true,
        })
    ]
};
