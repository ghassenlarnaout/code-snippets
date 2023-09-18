import { __, _x } from '@wordpress/i18n'
import React from 'react'
import { SnippetInputProps } from '../../types/SnippetInputProps'
import { CodeEditorInstance } from '../../types/WordPressCodeEditor'
import { createEmptySnippet } from '../../utils/snippets'

const OPTIONS = window.CODE_SNIPPETS_EDIT

interface PageHeadingProps extends SnippetInputProps {
	codeEditorInstance?: CodeEditorInstance
}

export const PageHeading: React.FC<PageHeadingProps> = ({ snippet, setSnippet, codeEditorInstance }) =>
	<h1>
		{snippet.id ?
			__('Edit Snippet', 'code-snippets') :
			__('Add New Snippet', 'code-snippets')}

		{snippet.id ? <>{' '}
			<a href={window.CODE_SNIPPETS?.urls.addNew} className="page-title-action" onClick={event => {
				event.preventDefault()

				setSnippet(() => createEmptySnippet())
				codeEditorInstance?.codemirror.setValue('')
				window.tinymce?.activeEditor.setContent('')

				window.document.title = window.document.title.replace(
					__('Edit Snippet', 'code-snippets'),
					__('Add New Snippet', 'code-snippets')
				)

				window.history.replaceState({}, window.document.title, window.CODE_SNIPPETS?.urls.addNew)
			}}>
				{_x('Add New', 'snippet', 'code-snippets')}
			</a>
		</> : null}

		{OPTIONS?.pageTitleActions && Object.entries(OPTIONS.pageTitleActions).map(([label, url]) =>
			<>
				<a key={label} href={url} className="page-title-action">{label}</a>
				{' '}
			</>
		)}
	</h1>
