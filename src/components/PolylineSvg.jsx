import React, { Component } from "react";

class PolylineSvg extends Component {
  constructor(props){
    super();
    this.state={
      startPt: "0,0",
      endPt: "0,0",
      midPt: []
    }
  }

  calcPolyLinePoints(){
    let {startPt, endPt, midPt} = this.state;

    let pts = startPt ;
    midPt.forEach(ele => {
      pts += " " + ele;
    });

    pts += " " + endPt;

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
			>
				<polyline
					points={pts}
					style="fill:white;stroke:red;stroke-width:2"
				/>
			</svg>
		);
	}
}

export default PolylineSvg;
