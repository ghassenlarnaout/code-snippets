import React from 'react'
import { __, _x } from '@wordpress/i18n'

export interface FileUploaderProps {
	onUpload: (files: FileList) => void
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) =>
	<>
		<form encType="multipart/form-data" method="post" className="media-upload-form type-form">
			<section
				className="drag-drop"
				onDragOver={event => event.preventDefault()}
				onDrop={event => {
					event.preventDefault()
					onUpload(event.dataTransfer.files)
				}}
			>
				<div id="drag-drop-area">
					<div className="drag-drop-inside">
						<p className="drag-drop-info">{__('Drop files to upload', 'code-snippets')}</p>
						<p>{_x('or', 'Uploader: Drop files here - or - Select Files', 'code-snippets')}</p>

						<p className="drag-drop-buttons">
							<label htmlFor="import-file-upload" className="button">{__('Select Files', 'code-snippets')}</label>

							<input
								id="import-file-upload"
								type="file"
								accept="application/json,.json"
								hidden
								multiple
								onChange={event => {
									if (event.target.files) {
										onUpload(event.target.files)
									}
								}}
							/>
						</p>
					</div>
				</div>
			</section>
		</form>
	</>
