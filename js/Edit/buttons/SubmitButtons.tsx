import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, ButtonProps } from '../../common/Button'
import { ConfirmDialog } from '../../common/ConfirmDialog'
import { Snippet } from '../../types/Snippet'
import { isNetworkAdmin } from '../../utils/general'
import { useSnippetForm } from '../SnippetForm/context'

const SaveChangesButton: React.FC<ButtonProps> = ({ ...props }) =>
	<Button
		name="save_snippet"
		type="submit"
		{...props}
	>
		{__('Save Changes', 'code-snippets')}
	</Button>

interface ActivateButtonProps {
	snippet: Snippet
	onActivate: VoidFunction
	onDeactivate: VoidFunction
	primaryActivate: boolean
	inlineButtons?: boolean
	disabled: boolean
}

const ActivateButton: React.FC<ActivateButtonProps> = ({
	snippet,
	disabled,
	onActivate,
	onDeactivate,
	inlineButtons,
	primaryActivate
}) => {
	if (snippet.shared_network && isNetworkAdmin()) {
		return null
	}

	if ('single-use' === snippet.scope) {
		return (
			<Button
				small={inlineButtons}
				type="submit"
				name="save_snippet_execute"
				onClick={onActivate}
				disabled={disabled}
				title={inlineButtons ? __('Save Snippet and Execute Once', 'code-snippets') : undefined}
			>
				{inlineButtons ?
					__('Execute Once', 'code-snippets') :
					__('Save Changes and Execute Once', 'code-snippets')}
			</Button>
		)
	}

	return snippet.active ?
		<Button
			small={inlineButtons}
			name="save_snippet_deactivate"
			title={inlineButtons ? __('Save Snippet and Deactivate', 'code-snippets') : undefined}
			onClick={onDeactivate}
			disabled={disabled}
		>
			{inlineButtons ?
				__('Deactivate', 'code-snippets') :
				__('Save Changes and Deactivate', 'code-snippets')}
		</Button> :
		<Button
			small={inlineButtons}
			type="submit"
			name="save_snippet_activate"
			title={inlineButtons ? __('Save Snippet and Activate', 'code-snippets') : undefined}
			primary={primaryActivate}
			onClick={onActivate}
			disabled={disabled}
		>
			{inlineButtons ?
				__('Activate', 'code-snippets') :
				__('Save Changes and Activate', 'code-snippets')}
		</Button>
}

const validateSnippet = (snippet: Snippet): undefined | string => {
	const missingCode = '' === snippet.code.trim()
	const missingTitle = '' === snippet.name.trim()

	switch (true) {
		case missingCode && missingTitle:
			return __('This snippet has no code or title.', 'code-snippets')

		case missingCode:
			return __('This snippet has no snippet code.', 'code-snippets')

		case missingTitle:
			return __('This snippet has no title.', 'code-snippets')

		default:
			return undefined
	}
}

export interface SubmitButtonsProps {
	inlineButtons?: boolean
}

export const SubmitButton: React.FC<SubmitButtonsProps> = ({ inlineButtons }) => {
	const { snippet, isWorking, submitSnippet, submitAndActivateSnippet, submitAndDeactivateSnippet } = useSnippetForm()
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
	const [submitAction, setSubmitAction] = useState<VoidFunction>()

	const validationWarning = validateSnippet(snippet)
	const activateByDefault = !inlineButtons && !!window.CODE_SNIPPETS_EDIT?.activateByDefault &&
		!snippet.active && 'single-use' !== snippet.scope &&
		(!snippet.shared_network || !isNetworkAdmin())

	const onSubmit = (submitAction: VoidFunction) => {
		if (validationWarning) {
			setIsConfirmDialogOpen(true)
			setSubmitAction(() => submitAction)
		} else {
			submitAction()
		}
	}

	const closeDialog = () => {
		setIsConfirmDialogOpen(false)
		setSubmitAction(undefined)
	}

	const saveChangesButtonProps: ButtonProps = {
		small: inlineButtons,
		title: inlineButtons ? __('Save Snippet', 'code-snippets') : undefined,
		onClick: () => onSubmit(submitSnippet),
		disabled: isWorking
	}

	return <>
		{activateByDefault ? null : <SaveChangesButton primary={!inlineButtons} {...saveChangesButtonProps} />}

		<ActivateButton
			snippet={snippet}
			disabled={isWorking}
			inlineButtons={inlineButtons}
			primaryActivate={activateByDefault}
			onActivate={() => onSubmit(submitAndActivateSnippet)}
			onDeactivate={() => onSubmit(submitAndDeactivateSnippet)}
		/>

		{activateByDefault ? <SaveChangesButton {...saveChangesButtonProps} /> : null}

		<ConfirmDialog
			open={isConfirmDialogOpen}
			title={__('Snippet incomplete', 'code-snippets')}
			confirmLabel={__('Continue', 'code-snippets')}
			onCancel={closeDialog}
			onConfirm={() => {
				submitAction?.()
				closeDialog()
			}}
		>
			<p>{`${validationWarning} ${__('Continue?', 'code-snippets')}`}</p>
		</ConfirmDialog>
	</>
}
