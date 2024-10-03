import { SNIPPET_SCOPES } from '../types/Snippet'
import { isNetworkAdmin } from './general'
import type { Snippet, SnippetScope, SnippetType } from '../types/Snippet'

const PRO_TYPES: SnippetType[] = ['css', 'js']

export const createEmptySnippet = (): Snippet => ({
	id: 0,
	name: '',
	desc: '',
	code: '',
	tags: [],
	scope: 'global',
	modified: '',
	active: false,
	network: isNetworkAdmin(),
	shared_network: null,
	priority: 10
})

export const getSnippetType = (snippetOrScope: Snippet | SnippetScope): SnippetType => {
	const scope = 'string' === typeof snippetOrScope ? snippetOrScope : snippetOrScope.scope

	switch (true) {
		case scope.endsWith('-css'):
			return 'css'

		case scope.endsWith('-js'):
			return 'js'

		case scope.endsWith('content'):
			return 'html'

		default:
			return 'php'
	}
}

export const isProSnippet = (snippet: Snippet | SnippetScope): boolean =>
	PRO_TYPES.includes(getSnippetType(snippet))

export const isProType = (type: SnippetType): boolean =>
	PRO_TYPES.includes(type)

export const parseSnippet = (snippet: unknown): Snippet => {
	const result: Snippet = createEmptySnippet()

	if ('object' !== typeof snippet || null === snippet) {
		return result
	}

	if ('id' in snippet && ('string' === typeof snippet.id || 'number' === typeof snippet.id)) {
		result.id = 'string' === typeof snippet.id ? parseInt(snippet.id) : snippet.id
	}

	if ('name' in snippet && 'string' === typeof snippet.name) {
		result.name = snippet.name
	}

	if ('desc' in snippet && 'string' === typeof snippet.desc) {
		result.desc = snippet.desc
	}

	if ('description' in snippet && 'string' === typeof snippet.description) {
		result.desc = snippet.description
	}

	if ('code' in snippet && 'string' === typeof snippet.code) {
		result.code = snippet.code
	}

	if ('tags' in snippet && Array.isArray(snippet.tags)) {
		result.tags = snippet.tags.filter(tag => 'string' === typeof tag)
	}

	if ('scope' in snippet && 'string' === typeof snippet.scope && SNIPPET_SCOPES.includes(<SnippetScope> snippet.scope)) {
		result.scope = <SnippetScope> snippet.scope
	}

	if ('priority' in snippet && 'number' === typeof snippet.priority) {
		result.id = snippet.priority
	}

	if ('active' in snippet) {
		result.active = Boolean(snippet.active)
	}

	if ('network' in snippet) {
		result.network = Boolean(snippet.network)
	}

	if ('shared_network' in snippet) {
		result.shared_network = Boolean(snippet.shared_network)
	}

	if ('modified' in snippet && 'string' === typeof snippet.modified) {
		result.modified = snippet.modified
	}

	return result
}
