import React from "react";

const parseMarkdown = (string) => {
  if (!string) return;
  const childElements = [];
  const allLines = string.split("\n");

  const linkRegex = /\[([^\[\]]*)\]\((.*?)\)/gm;

  let index = 0;
  for (const line of allLines) {
    if (line.match(linkRegex)) {
      const newElement = React.createElement("a", { key: index++, href: line.replace(linkRegex, "$2") }, line.replace(linkRegex, "$1"));
      childElements.push(newElement);
    }
    if (line.charAt(0) === "#") {
      const newElement = React.createElement("h3", { key: index++ }, line.replace("#", ""));
      const hr = React.createElement("hr", { key: index + "hr" }, null);
      childElements.push(newElement);
      childElements.push(hr);
    } else if (line.charAt(0) === "-") {
      const newElement = React.createElement("li", { key: index++ }, line.replace("-", ""));
      childElements.push(newElement);
    } else if (line.length === 0) {
      const newElement = React.createElement("br", { key: index++ }, null);
      childElements.push(newElement);
    } else {
      const newElement = React.createElement("p", { key: index++ }, line);
      childElements.push(newElement);
    }
  }

  return React.createElement("div", {}, childElements);
};

export default parseMarkdown;
