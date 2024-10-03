import { __, _x } from '@wordpress/i18n'
import React, { useState } from 'react'
import { ImportedSnippet } from '../../types/ImportedSnippet'
import { readFileContents } from '../../utils/files'
import { FileUploader } from '../common/FileUploader'

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

const parseImportFile = (contents: string): ImportedSnippet[] => {
	const exported: unknown = JSON.parse(contents)

	if (typeof exported !== 'object' || exported === null || !('snippets' in exported) || !Array.isArray(exported.snippets)) {
		return []
	}

	return exported.snippets.map((importedSnippet: Record<string, unknown>) => ({
		id: 0,
		uuid: new Date().getTime().toString(),
		name: importedSnippet.name ?? '',
		code: importedSnippet.code ?? '',
		desc: importedSnippet.desc ?? '',
		priority: importedSnippet.priority ?? 10,
		scope: importedSnippet.scope ?? 'global',
		tags: importedSnippet.tags ?? [],
		active: false
	}) as ImportedSnippet)
}

export const ImportMenu: React.FC = () => {
	const [snippets, setSnippets] = useState<ImportedSnippet[]>([])

	const handleUpload = async (files: FileList) => {
		for (const file of files) {
			readFileContents(file).then(content =>
				setSnippets(previous => [
					...previous ?? [],
					...parseImportFile(content)
				])
			)
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
