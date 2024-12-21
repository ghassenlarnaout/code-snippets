import React from 'react'
import { __ } from '@wordpress/i18n'
import { useSnippetForm } from '../../../hooks/useSnippetForm'

export const PriorityInput = () => {
	const { snippet, isReadOnly, setSnippet } = useSnippetForm()

	return (
		<div
			className="snippet-priority"
			title={__('Snippets with a lower priority number will run before those with a higher number.', 'code-snippets')}
		>
			<h4>
				<label htmlFor="snippet-priority">
					{__('Priority', 'code-snippets')}
				</label>
			</h4>

			<input
				type="number"
				id="snippet-priority"
				name="snippet_priority"
				value={snippet.priority}
				disabled={isReadOnly}
				onChange={event => setSnippet(previous => ({
					...previous,
					priority: parseInt(event.target.value, 10)
				}))}
			/>
		</div>
	)
}
