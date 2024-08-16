import fs from 'fs'
import path from 'path'
import pkg from '../package.json'

const replaceInFile = (filename: string, transform: (contents: string) => string) => {
	const file = path.join(__dirname, '..', filename)
	const contents = fs.readFileSync(file, 'utf8')
	fs.writeFileSync(file, transform(contents), 'utf8')
}

replaceInFile(
	'code-snippets.php',
	contents => contents
		.replace(/(?<prefix>Version:\s+|@version\s+)\d+\.\d+[\w-.]+$/mg, `$1${pkg.version}`)
		.replace(/(?<prefix>'CODE_SNIPPETS_VERSION',\s+)'[\w-.]+'/, `$1'${pkg.version}'`)
)

replaceInFile(
	'readme.txt',
	contents => contents
		.replace(/(?<prefix>Stable tag:\s+|@version\s+)\d+\.\d+[\w-.]+$/mg, `$1${pkg.version}`)
)
