import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { handleUnknownError } from '../../utils/errors'
import { readFileContents } from '../../utils/files'
import { parseSnippet } from '../../utils/snippets'
import { FileUploader } from '../common/FileUploader'
import type { ImportedSnippet } from '../../types/ImportedSnippet'

interface ImportedSnippetsListProps {
	snippets: ImportedSnippet[]
}

const ImportedSnippetsList: React.FC<ImportedSnippetsListProps> = ({ snippets }) =>
	<div className="imported-snippets-list">
		{snippets.map(snippet =>
			<div className="imported-snippet" key={snippet.uuid}>
				<p><strong>{snippet.name}</strong></p>
			</div>
		)}
	</div>

const parseImportFile = (exported: unknown): ImportedSnippet[] =>
	'object' === typeof exported && null !== exported && 'snippets' in exported && Array.isArray(exported.snippets) ?
		exported.snippets.map((snippet: unknown): ImportedSnippet => ({
			...parseSnippet(snippet),
			id: 0,
			active: false,
			uuid: new Date().getTime().toString()
		})) :
		[]

export const ImportMenu: React.FC = () => {
	const [snippets, setSnippets] = useState<ImportedSnippet[]>([])

	const handleUpload = (files: FileList) => {
		for (const file of files) {
			readFileContents(file)
				.then(contents =>
					setSnippets(previous => [
						...previous,
						...parseImportFile(JSON.parse(contents))
					])
				)
				.catch(handleUnknownError)
		}
	}

	return (
		<div className="wrap">
			<h1>{__('Import Snippets', 'code-snippets')}</h1>

			<div className="narrow">
				<FileUploader onUpload={handleUpload} />
				<ImportedSnippetsList snippets={snippets} />
			</div>
		</div>
	)
}
