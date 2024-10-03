import React from 'react'
import { createRoot } from 'react-dom/client'
import { ImportMenu } from './components/ImportMenu/ImportMenu'

const container = document.getElementById('import-snippets-container')

if (container) {
	const root = createRoot(container)
	root.render(<ImportMenu />)
} else {
	console.error('Could not find import menu container.')
}
