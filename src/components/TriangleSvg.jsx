import React, { Component } from 'react';
import ResizeSvgHOC from "./ResizeSvgHOC";

class TriangleSvg extends Component {
  render() {
    let { padding,border, contentWidth, contentHeight } = this.props;

    let bp = padding + border;
    let points = `${bp},${contentHeight + bp} 
      ${contentWidth / 2 + bp},${bp} 
      ${contentWidth + bp}, ${contentHeight + bp} `;

    return (
      <polygon
        points={points}
        style={{ fill: "green", strokeWidth: 8, stroke: '#000', strokeOpacity: '0.3'}}
			/>
    );
  }
}

export default ResizeSvgHOC(TriangleSvg);