import { exec } from 'child_process'
import { createWriteStream, promises as fs } from 'fs'
import { webpack } from 'webpack'
import pkg from '../package.json'
import webpackConfig from '../webpack.config'
import { cleanup, copy, resolve } from './utils/files'
import archiver from 'archiver'

const DEST_DIR = 'bundle/'

const BUNDLE_FILES = [
	'assets/**/*',
	'css/**/*',
	'js/**/*',
	'dist/**/*',
	'!dist/**/*.map',
	'php/**/*',
	'vendor/**/*',
	'code-snippets.php',
	'uninstall.php',
	'readme.txt',
	'license.txt',
	'CHANGELOG.md'
]

const execute = (command: string): Promise<string> =>
	new Promise((resolve, reject) => {
		exec(command, (error, stdout) => {
			error ? reject(error) : resolve(stdout)
		})
	})

const webpackProduction = (): Promise<void> =>
	new Promise((resolve, reject) =>
		webpack({ ...webpackConfig, mode: 'production' }, error => {
			error ? reject(error) : resolve()
		})
	)

export const createArchive = (): void => {
	const filename = `${pkg.name}.${pkg.version}.zip`
	console.info(`creating '${filename}'`)

	const output = createWriteStream(resolve(filename), 'utf8')
	const archive = archiver('zip', {
		zlib: { level: 9 }
	})

	archive.pipe(output)
	archive.directory(DEST_DIR, pkg.name)
	archive.finalize()
}

const bundle = async () => {
	console.log('generating composer and webpack files')

	await Promise.all([
		cleanup(`${pkg.name}.*.zip`),
		execute('composer install --no-dev'),
		webpackProduction()
	])

	await copy(BUNDLE_FILES, DEST_DIR)
	createArchive()

	await execute('composer install')
}

bundle().then()
