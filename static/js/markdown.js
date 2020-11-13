export function getParsedText(textareaElement) {
  let values = textareaElement.value;
  let lineArray = values.split("\n");
  const bold = /\*\*[^\*\n]+\*\*/gm;
  const italics = /\*[^\*][^\*\n]+[^\*]\*/gm;
  lineArray = lineArray.map((line) => {
    if (bold.test(line)) {
      const matches = line.match(bold);

      matches.forEach((element) => {
        const extractedText = element.slice(2, -2);
        line = line.replace(element, "<strong>" + extractedText + "</strong>");
      });
    }
    if (italics.test(line)) {
      const matches = line.match(italics);

      matches.forEach((element) => {
        const extractedText = element.slice(1, -1);
        line = line.replace(element, "<em>" + extractedText + "</em>");
      });
    }
    return line;
  });
  return lineArray.join("<br/>");
}

function getItalicsText(text) {
  const element = document.createElement("em");
  element.textContent = text;
  return element;
}
