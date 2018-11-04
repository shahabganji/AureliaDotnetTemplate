const path = require("path");
const webpack = require("webpack");
const {
	AureliaPlugin,
	ModuleDependenciesPlugin,
	GlobDependenciesPlugin
} = require("aurelia-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const bundleOutputDir = "./wwwroot/dist";
const cssRules = [{
	loader: 'css-loader'
}, ];

module.exports = (env, argv, extractCss) => {
	if ((!argv || !argv.mode) && process.env.ASPNETCORE_ENVIRONMENT === "Development") {
		argv = {
			mode: "development"
		};
	}
	console.log("mode=", argv.mode);
	const isDevBuild = argv.mode !== "production";

	return [{
		target: "web",
		mode: isDevBuild ? "development" : "production",
		entry: {
			"app": ["es6-promise/auto", "aurelia-bootstrapper"]
		},
		resolve: {
			extensions: [".ts", ".js"],
			modules: ["ClientApp", "node_modules"]
		},
		output: {
			path: path.resolve(bundleOutputDir),
			publicPath: "/dist/",
			filename: "[name].js",
			chunkFilename: "[name].js"
		},
		module: {
			rules: [{
					test: /\.(woff|woff2)(\?|$)/,
					loader: "url-loader?limit=1"
				},
				{
					test: /\.(png|eot|ttf|svg)(\?|$)/,
					loader: "url-loader?limit=100000"
				},
				{
					test: /\.ts$/i,
					include: [/ClientApp/, /node_modules/],
					use: "awesome-typescript-loader"
				},
				{
					test: /\.html$/i,
					use: "html-loader"
				},
				{
					test: /\.css$/i,
					issuer: [{
						not: [{
							test: /\.html$/i
						}]
					}],
					use: extractCss ? [{
							loader: MiniCssExtractPlugin.loader
						},
						'css-loader'
					] : ['style-loader', ...cssRules]
				},
				{
					test: /\.css$/i,
					issuer: [{
						test: /\.html$/i
					}],
					// CSS required in templates cannot be extracted safely
					// because Aurelia would try to require it again in runtime
					use: cssRules
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader'],
					issuer: /\.[tj]s$/i
				},
				{
					test: /\.scss$/,
					use: ['css-loader', 'sass-loader'],
					issuer: /\.html?$/i
				},
			]
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendor",
						chunks: "all"
					}
				}
			}
		},
		devtool: isDevBuild ? "source-map" : false,
		performance: {
			hints: false
		},
		plugins: [
			new webpack.DefinePlugin({
				IS_DEV_BUILD: JSON.stringify(isDevBuild)
			}),
			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery",
				"window.jQuery": "jquery"
			}),
			new AureliaPlugin({
				aureliaApp: "boot"
			}),
			new GlobDependenciesPlugin({
				"boot": ["ClientApp/**/*.{ts,html}"]
			}),
			new ModuleDependenciesPlugin({}),
			new MiniCssExtractPlugin({
				filename: !isDevBuild /*production*/ ? '[contenthash].css' : '[id].css',
				allChunks: true
			})
		]
	}];
};