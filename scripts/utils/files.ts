import fs from 'fs/promises'
import { createWriteStream, createReadStream } from 'fs'
import { join, dirname, basename } from 'path'
import { glob } from 'glob'
import archiver from 'archiver'

export const resolve = (...parts: string[]) =>
	join(__dirname, '..', '..', ...parts)

export const cleanup = (...paths: string[]): Promise<Awaited<void>[]> =>
	Promise.all(paths.map(filename =>
		fs.rm(resolve(filename), { force: true, recursive: true })
	))

export const copy = async (patterns: string[], dest: string): Promise<void> => {
	const filenames = await glob(patterns)
	await fs.rm(dest, { force: true, recursive: true })
	await fs.mkdir(dest, { recursive: true })

	console.log(filenames)

	filenames.map(async (filename) => {
		const stats = await fs.stat(resolve(filename))

		if (!stats.isDirectory()) {
			console.log(`copying ${filename}`)
			const destPath = resolve(dest, filename)

			await fs.mkdir(dirname(destPath), { recursive: true })
			const out = createWriteStream(destPath, 'utf8')
			createReadStream(filename).pipe(out)
		}
	})

	console.log('all files copied')
}
