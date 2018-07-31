import React, { Component } from "react";
import ResizeSvgHOC from "./ResizeSvgHOC";

class DiamondSvg extends Component {
	render() {
		let { padding, border, contentWidth, contentHeight, shapeVo } = this.props;
		let bp = padding + border;
		let points = `${bp},${contentHeight / 2 + bp} 
    ${contentWidth / 2 + bp},${bp} 
    ${contentWidth + bp}, ${contentHeight / 2 + bp} 
    ${contentWidth / 2 + bp},${contentHeight + bp}`;

		// console.log(points);
		return (
			<g>
				<polygon
					points={points}
					style={{
						fill: "green",
						strokeWidth: 8,
						stroke: "#000",
						strokeOpacity: "0.3"
					}}
				/>
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

export default ResizeSvgHOC(DiamondSvg);
