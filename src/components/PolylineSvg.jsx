import React, { Component } from "react";
import CoordinateCalcUtils from '../utils/CoordinateCalcUtils';

class PolylineSvg extends Component {
	constructor(props) {
		super();

		let { startPt, endPt } = props;
		this.state = {
			startPt: startPt || "0,0",
			endPt: endPt || "0,0",
			midPt: []
		};
	}

	componentWillReceiveProps(nextProps) {
		// console.log(nextProps);
		// console.log('PolylineSvg componentWillReceiveProps', nextProps);
	}

	calcPolyLinePoints() {
		
		let { lineVo } = this.props;
		let pts = CoordinateCalcUtils.calcPointsByLineVo(lineVo);
		return pts;
	}

	render() {
		let pts = this.calcPolyLinePoints();

		return (
			<svg
				width="100%"
        height="100%"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				style={{ position: "absolute", pointerEvents: "none" }}
			>
				<defs>
					<marker
						id="circle"
						markerWidth="10"
						markerHeight="10"
						refX="4"
            refY="4"
            orient="auto"
					>
						<circle
							cx="4"
							cy="4"
							r="2"
							style={{fill: `#F76258`, stroke: 'none'}}
						/>
					</marker>
					<marker
						id="arrow"
						markerWidth="10"
						markerHeight="8"
						refX="7"
						refY="2"
						orient="auto"
					>
						<path
							d="M 0 0 8 2 0 4"
							style={{fill: `#F76258`, stroke: 'none'}}
						/>
					</marker>
				</defs>
				<polyline
					style={{ pointerEvents: "auto" }}
					points={pts}
					style={{ fill: "none", stroke: "#F76258", strokeWidth: 2 , markerStart: "url(#circle)", markerEnd: "url(#arrow)"}}
				/>
			</svg>
		);
	}
}

export default PolylineSvg;
