export function createVirtualDOM(html) {
	const virtualDocument = document.implementation.createHTMLDocument();
	const virtualDocumentHMLT = virtualDocument.createElement('html');
	virtualDocumentHMLT.innerHTML = html;
	return virtualDocumentHMLT;
}
