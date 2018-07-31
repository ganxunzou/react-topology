import React, { Component } from "react";
import ResizeSvgHOC from "./ResizeSvgHOC";

let len = 20;
class ParallelogramSvg extends Component {
	render() {
    let { padding, border, contentWidth, contentHeight } = this.props;
    let bp = padding + border;
		let points = `${bp},${contentHeight + bp} 
    ${bp + 20},${bp} 
    ${contentWidth + bp}, ${bp} 
    ${contentWidth + bp - 20},${contentHeight + bp}`;

		return (
			<g>
				<polygon points={points} style={{
						fill: "green",
						strokeWidth: 8,
						stroke: "#000",
						strokeOpacity: "0.3"
					}} />
				<text
					x={padding + border + contentWidth / 2}
					y={padding + border + contentHeight / 2}
					style={{
						textAnchor: "middle",
						dominantBaseline: "middle",
						fill: "#fff"
					}}
				>
					{shapeVo.text}
				</text>
			</g>
		);
	}
}

export default ResizeSvgHOC(ParallelogramSvg);
