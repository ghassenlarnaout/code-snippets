import Prism from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-markup'
import 'prismjs/plugins/keep-markup/prism-keep-markup'

//Handle clicks on snippet preview button
export const handleShowCloudPreview = () => {
	const previewButtons = document.querySelectorAll('.cloud-snippet-preview')
	//Add click event listener to buttons
	previewButtons.forEach(button => {
		button.addEventListener('click', () => {
			const snippetId = button.getAttribute('data-snippet')
			const snippetLanguage = button.getAttribute('data-lang')

			const snippetNameInput = <HTMLInputElement>document.getElementById(`cloud-snippet-name-${snippetId}`)
			const snippetName = snippetNameInput?.value

			const snippetCodeInput = <HTMLInputElement>document.getElementById(`cloud-snippet-code-${snippetId}`)
			const snippetCode = snippetCodeInput?.value

			const snippetNameModalTag = <HTMLElement>document.getElementById('snippet-name-thickbox')
			const snippetCodeModalTag = <HTMLElement>document.getElementById('snippet-code-thickbox')

			console.log(snippetId, snippetLanguage)

			snippetNameModalTag.textContent = snippetName
			snippetCodeModalTag.classList.remove(...snippetCodeModalTag.classList)
			snippetCodeModalTag.classList.add(`language-${snippetLanguage}`)
			snippetCodeModalTag.innerHTML = snippetCode

			if ('markup' === snippetLanguage) {
				snippetCodeModalTag.innerHTML = `<xmp>${snippetCode}</xmp>`
			}

			Prism.highlightElement(snippetCodeModalTag)
		})
	})
}

//Handle clicks on snippet search button
export const handleClickSearchCloud = () => {
	const searchButton = document.getElementById('cloud-search-submit')
	const searchForm = <HTMLFormElement>document.getElementById('cloud-search-form')
	searchButton?.addEventListener('click', event => {
		event.preventDefault()
		window.location.hash = ''
		searchForm?.submit()
	})
}

