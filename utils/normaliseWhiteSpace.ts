// Replaces all occurences of large whitespace with a single space instead 
function normaliseWhiteSpace(text: string) {
	return text.replaceAll(/[\s]+/g, " ")
}

export default normaliseWhiteSpace