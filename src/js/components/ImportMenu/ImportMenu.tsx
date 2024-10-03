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
	snippets.length > 0 &&
	<form className="imported-snippets-list">
		<table className="widefat striped">
			<thead>
			<tr>
				<td id="cb" className="check-column"><input type="checkbox" /></td>
				<th className="snippet-column">{__('Snippet', 'code-snippets')}</th>
				<th className="import-button-column"></th>
				<th className="expand-icon-column"></th>
			</tr>
			</thead>
			<tbody>
						{snippets.map(snippet =>
							<tr className="imported-snippet" key={snippet.uuid}>
								<th scope="row" className="check-column"><input type="checkbox" /></th>
								<th className="snippet-column">
									<h3 role="button">{snippet.name}</h3>
								</th>
								<td className="import-button-column">
									<button className="button button-primary">Import</button>
								</td>
								<td className="expand-icon-column"><span role="button"></span></td>
							</tr>
						)}
			</tbody>
		</table>

		<p className="submit">
			<button className="button button-primary button-large">{__('Import selected', 'code-snippets')}</button>
		</p>
	</form>

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
