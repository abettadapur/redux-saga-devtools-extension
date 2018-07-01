var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (mode) => {
    const distPath = path.join(__dirname, "dist", mode);
    const extpath = path.join(__dirname, "src");

    return {
        mode: mode,
        entry: {
            background: [path.join(extpath, "background", "background")],
            devpanel: [path.join(extpath, "devpanel", "devpanel")],
            devtools: [path.join(extpath, "devtools", "devtools")],
            content: [path.join(extpath, "inject", "contentScript")],
            page: [path.join(extpath, "inject", "pageScript")],
            pagewrap: [path.join(extpath, "inject", "pageWrap")]
        },
        devtool: 'cheap-module-source-map',
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js',
            path: path.join(distPath, "js")
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: `"${mode}"`
                }
            }),

            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new CopyWebpackPlugin([
                {
                    from: `${extpath}/views/*`,
                    to: `${distPath}`,
                    flatten: true
                },
                {
                    from: `${extpath}/manifest.json`,
                    to: `${distPath}`,
                    flatten: true
                }
            ])

        ],
        resolve: {
            extensions: ['.js', '.jsx']
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /(node_modules|tmp\/page\.bundle)/
                },
                {
                    test: /\.css?$/,
                    use: ['style-loader', 'raw-loader'],
                }
            ]
        }
    }
};