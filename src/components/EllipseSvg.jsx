import React, { Component } from "react";
import ResizeSvgHOC from "./ResizeSvgHOC";

class EllipseSvg extends Component {
	render() {
		let { padding, border, contentWidth, contentHeight, shapeVo } = this.props;
		return (
			<g>
				<ellipse
					cx={contentWidth / 2 + padding + border}
					cy={contentHeight / 2 + padding + border}
					rx={contentWidth / 2}
					ry={contentHeight / 2}
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

export default ResizeSvgHOC(EllipseSvg);
