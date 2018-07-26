import React, { Component } from "react";

class PolylineSvg extends Component {
  constructor(props){
    super();
    
    let {startPt, endPt} = props;
    this.state={
      startPt: startPt || "0,0",
      endPt: endPt || "0,0",
      midPt: []
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    // console.log('PolylineSvg componentWillReceiveProps', nextProps);
  }
  

  calcPolyLinePoints(){
    let {startPt, endPt} = this.props;

    let pts = startPt ;
    pts += " " + endPt;
    console.log('pts', pts);
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
        style={{position:'absolute'}}
			>
				<polyline
          points={pts}
          style={{fill:'none', stroke:'#000', strokeWidth:2}}
				/>
			</svg>
		);
	}
}

export default PolylineSvg;
