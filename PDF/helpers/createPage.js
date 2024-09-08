export default function createPage(
	pdfDoc,
	customFont,
	width,
	height,
	font_size
) {
	const page = pdfDoc.addPage([width, height]);
	page.setFont(customFont);
	page.setFontSize(font_size);
	return page;
}
