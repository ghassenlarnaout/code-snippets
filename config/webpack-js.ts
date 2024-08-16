import path from 'path'
import { DefinePlugin, Configuration } from 'webpack'
import ESLintPlugin from 'eslint-webpack-plugin'
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts'

const SOURCE_DIR = './js'

export const jsWebpackConfig: Configuration = {
	entry: {
		manage: `${SOURCE_DIR}/manage/index.ts`,
		edit: {
			import: `${SOURCE_DIR}/Edit/index.tsx`,
			dependOn: 'editor'
		},
		settings: {
			import: `${SOURCE_DIR}/settings/index.ts`,
			dependOn: 'editor'
		},
		mce: `${SOURCE_DIR}/mce.ts`,
		prism: `${SOURCE_DIR}/prism.ts`,
		editor: `${SOURCE_DIR}/editor.ts`
	},
	output: {
		path: path.join(path.resolve(__dirname), '..', 'dist'),
		filename: '[name].js',
		clean: true
	},
	externalsType: 'window',
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'jquery': 'jQuery',
		'tinymce': 'tinymce',
		'codemirror': ['wp', 'CodeMirror'],
		...Object.fromEntries(
			['api-fetch', 'block-editor', 'blocks', 'components', 'data', 'i18n', 'server-side-render']
				.map(p => [
					`@wordpress/${p}`,
					['wp', p.replace(/-(?<letter>[a-z])/g, (_, letter) => letter.toUpperCase())]
				])
		)
	},
	resolve: {
		modules: [path.resolve(__dirname, '..', 'node_modules')],
		extensions: ['.ts', '.tsx', '.js', '.json'],
		alias: {
			'php-parser': path.resolve(__dirname, '../node_modules/php-parser/src/index.js')
		}
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@wordpress/babel-preset-default'
						],
						plugins: [
							['prismjs', {
								languages: ['php', 'php-extras'],
								plugins: ['line-highlight', 'line-numbers']
							}]
						]
					}
				}
			}
		]
	},
	plugins: [
		new DefinePlugin({
			'process.arch': JSON.stringify('x64')
		}),
		new ESLintPlugin(),
		new RemoveEmptyScriptsPlugin()
	]
}
