import React, { Component } from "react";
import ResizeSvgHOC from "./ResizeSvgHOC";

class EllipseSvg extends Component {
	render() {
    let { padding,border, contentWidth, contentHeight } = this.props;
		return (
			<ellipse
				cx={contentWidth / 2 + padding + border}
        cy={contentHeight / 2 + padding + border}
        rx={contentWidth/2}
        ry={contentHeight/2}
				style={{ fill: "green", strokeWidth: 8, stroke: '#000', strokeOpacity: '0.3'}}
			/>
		);
	}
}

export default ResizeSvgHOC(EllipseSvg);
