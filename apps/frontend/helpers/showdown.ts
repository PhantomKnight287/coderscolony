import { Converter } from "showdown";
export function getMarkdownString(html: string) {
	const converter = new Converter({
		emoji: true,
		strikethrough: true,
		tables: true,
		tablesHeaderId: true,
		underline: true,
		tasklists: true,
		parseImgDimensions: true,
		customizedHeaderId: true,
		ghCodeBlocks: true,
		ghCompatibleHeaderId: true,
		openLinksInNewWindow: true,
	});
	converter.setFlavor("github");
	const converted = converter.makeMarkdown(convertMarkdownToHTML(html));
	return converted;
}

export function convertMarkdownToHTML(md: string) {
	const converter = new Converter({
		emoji: true,
		strikethrough: true,
		tables: true,
		tablesHeaderId: true,
		underline: true,
		tasklists: true,
		// extensions: [
		//   showdownHighlight({
		//     auto_detection: true,
		//     pre: true,
		//   }),
		// ],
	});
	converter.setFlavor("github");
	const converted = converter.makeHtml(md);
	return converted;
}
