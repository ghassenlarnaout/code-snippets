import React, { useEffect } from 'react'
import { __, _x } from '@wordpress/i18n'
import Select from 'react-select'
import { useSnippetForm } from '../../../hooks/useSnippetForm'
import { SNIPPET_TYPES, SNIPPET_TYPE_SCOPES } from '../../../types/Snippet'
import { isLicensed } from '../../../utils/general'
import { getSnippetType, isProType } from '../../../utils/snippets'
import type { SnippetType } from '../../../types/Snippet'
import type { SelectOption } from '../../../types/SelectOption'
import type { EditorConfiguration } from 'codemirror'

export interface SnippetTypeInputProps {
	openUpgradeDialog: VoidFunction
}

const TYPE_LABELS: Record<SnippetType, string> = {
	php: __('Functions', 'code-snippets'),
	html: __('Content', 'code-snippets'),
	css: __('Styles', 'code-snippets'),
	js: __('Scripts', 'code-snippets')
}

const EDITOR_MODES: Partial<Record<SnippetType, string>> = {
	css: 'text/css',
	js: 'javascript',
	php: 'text/x-php',
	html: 'application/x-httpd-php'
}

const OPTIONS: SelectOption<SnippetType>[] = SNIPPET_TYPES.map(snippetType =>
	({ label: TYPE_LABELS[snippetType], value: snippetType }))

const SnippetTypeOption: React.FC<SelectOption<SnippetType>> = ({ label, value }) =>
	<div className="snippet-type-option">
		<div>
			{label}
			{isProType(value) && !isLicensed() &&
		  <span className="badge go-pro-badge">{_x('Pro', 'Upgrade to Pro', 'code-snippets')}</span>}
		</div>
		<div className="snippet-type-badge snippet-type-badge-inverted badge" data-snippet-type={value}>{value.toUpperCase()}</div>
	</div>

export const SnippetTypeInput: React.FC<SnippetTypeInputProps> = ({ openUpgradeDialog }) => {
	const { snippet, setSnippet, codeEditorInstance } = useSnippetForm()

	const snippetType = getSnippetType(snippet.scope)

	useEffect(() => {
		if (codeEditorInstance) {
			const codeEditor = codeEditorInstance.codemirror

			codeEditor.setOption('lint' as keyof EditorConfiguration, 'php' === snippetType || 'css' === snippetType)

			if (snippetType in EDITOR_MODES) {
				codeEditor.setOption('mode', EDITOR_MODES[snippetType])
				codeEditor.refresh()
			}
		}
	}, [codeEditorInstance, snippetType])

	return (
		<div className="snippet-type-container">
			<label><h3>{__('Snippet Type', 'code-snippets')}</h3></label>
			<Select
				options={OPTIONS}
				value={OPTIONS.find(option => option.value === snippetType)}
				styles={{
					menu: provided => ({ ...provided, zIndex: 9999 }),
					input: provided => ({ ...provided, boxShadow: 'none' })
				}}
				formatOptionLabel={SnippetTypeOption}
				onChange={option => {
					if (option && isProType(option.value) && !isLicensed()) {
						openUpgradeDialog()
					} else if (option) {
						setSnippet(previous => ({
							...previous,
							scope: SNIPPET_TYPE_SCOPES[option.value][0]
						}))
					}
				}}
			/>
		</div>
	)
}
