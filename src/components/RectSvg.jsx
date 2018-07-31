import React, { Component } from "react";
import ResizeSvgHOC from "./ResizeSvgHOC";

class RectSvg extends Component {
	constructor(props) {
		super();
	}
	render() {
		let {
			padding,
			border,
			contentWidth,
			contentHeight,
			shapeVo,
			id,
			...otherProps
		} = this.props;
		let { rx, ry } = otherProps;
		return (
			<g>
				<rect
					x={padding + border}
					y={padding + border}
					width={contentWidth}
					height={contentHeight}
					style={{
						fill: "green",
						strokeWidth: 8,
						stroke: "#000",
						strokeOpacity: "0.3"
					}}
					rx={rx}
					ry={ry}
				/>

				<text
					x={padding + border + contentWidth / 2}
					y={padding + border + contentHeight / 2}
					style={{ textAnchor: "middle", dominantBaseline: "middle",fill:'#fff' }}
				>
					{shapeVo.text}
				</text>
			</g>
		);
	}
}

export default ResizeSvgHOC(RectSvg);
