import React from 'react'
import { __ } from '@wordpress/i18n'
import { useSnippetForm } from '../../../hooks/useSnippetForm'

export const MultisiteSharingSettings: React.FC = () => {
	const { snippet, setSnippet, isReadOnly } = useSnippetForm()

	return (
		<div title={__('Allow this snippet to be activated on individual sites on the network', 'code-snippets')}>
			<h4>
				<label htmlFor="snippet_sharing">
					{__('Share with Subsites', 'code-snippets')}
				</label>
			</h4>

			<code>{JSON.stringify(snippet.shared_network)}</code>

			<input
				id="snippet_sharing"
				name="snippet_sharing"
				type="checkbox"
				className="switch"
				checked={true === snippet.shared_network}
				disabled={isReadOnly}
				onChange={event =>
					setSnippet(previous => ({
						...previous,
						active: false,
						shared_network: event.target.checked
					}))}
			/>
		</div>
	)
}
