const ExtractTextPlugin = require('extract-text-webpack-plugin');
const include = require('./babel-includes');
const stringReplaceRule = require('./string-replace');

module.exports = [
    stringReplaceRule,
    {
        oneOf: [
            // ES6 JS
            {
                test: /\.jsx?$/,
                include,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [require('@babel/preset-env')],
                        require('@babel/preset-react'),
                    ],
                    plugins: [require('@babel/plugin-proposal-class-properties')]
                },
            },

            // CSS Modules
            {
                test: /\.local\.css$/,
                include,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[name]_[local]-[hash:base64:8]',
                            },
                        },
                    ],
                }),
            },

            // global CSS
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader'],
                }),
            },

            // files
            {
                exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                loader: 'file-loader',
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
        ],
    },
];
