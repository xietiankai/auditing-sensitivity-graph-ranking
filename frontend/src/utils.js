let d3 = require("d3");

export function toolTipGenerator(rootTag) {
  const tooltip = d3
    .select(rootTag)
    .append("div")
    .style("position", "absolute")
    .style("display", "none")
    .style("height", "auto")
    .style("font-family", "Sans-serif")
    .style("font-size", "12px")
    .style("color", "white")
    .style("border-radius", "2px")
    .style("background", "none repeat scroll 0 0 #424242")
    .style("border", "1px solid #6F257F")
    .style("padding", "10px")
    .style("z-index", 1800)
    .style("text-align", "center");
  return tooltip;
}
