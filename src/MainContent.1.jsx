import React, { Component } from "react";
import ReactDOM from "react-dom";
import uuidv1 from "uuid/v1";
import { Layout } from "antd";
const { Content } = Layout;

import { ShapeType, LineType, SelType } from "./constant";
import { DiamondSvg, EllipseSvg, RectSvg, TriangleSvg } from "react-resize-svg";
import PolylineSvg from "./components/PolylineSvg";

class MainContent extends Component {
	constructor(props) {
		super();
		this.state = {
			shapeVos: {}, // key: uuid , value ShapeVo
			line: undefined
		};
	}

	createShape = (selType, selKey, top, left) => {
		if(selType == SelType.SHAPE){
			this.dealCreateShape(selKey, top, left)
		} else if(selType == SelType.LINE){

		}
	};

	dealCreateShape=(selKey, top, left)=>{
		let { shapes } = this.state;
		switch (selKey) {
			case ShapeType.Rect:
				shapes.push(
					<RectSvg
						key={uuidv1()}
						width="100"
						height="100"
						top={top}
						left={left}
						style={{ fill: "red" }}
					/>
				);
				break;

			case ShapeType.Diamond:
				shapes.push(
					<DiamondSvg
						key={uuidv1()}
						width="100"
						height="100"
						top={top}
						left={left}
						style={{ fill: "red" }}
					/>
				);
				break;

			case ShapeType.Ellipse:
				shapes.push(
					<EllipseSvg
						key={uuidv1()}
						width="100"
						height="100"
						top={top}
						left={left}
						style={{ fill: "red" }}
					/>
				);
				break;

			case ShapeType.Triangle:
				shapes.push(
					<TriangleSvg
						key={uuidv1()}
						width="100"
						height="100"
						top={top}
						left={left}
						style={{ fill: "red" }}
					/>
				);
				break;
		}

		this.setState({ shapes });
	}

	mainClickHandler = e => {
		if (e.target != ReactDOM.findDOMNode(this.refs.mainContent)) return;

		let { selKey, isLock, selType } = this.props;
		isLock &&
			this.createShape(
				selType,
				selKey,
				e.nativeEvent.offsetY,
				e.nativeEvent.offsetX
			);
	};

	mainMouseDownHandler = e => {
		if(e.target != ReactDOM.findDOMNode(this.refs.mainContent))
		  return;

		// let { line } = this.state;
		// if (line != null) return;

		// line = (
		// 	<PolylineSvg
		// 		startPt={`${e.nativeEvent.offsetX},${e.nativeEvent.offsetY}`}
		// 		endPt={`${e.nativeEvent.offsetX},${e.nativeEvent.offsetY}`}
		// 		key={uuidv1()}
		// 	/>
		// );

		// this.setState({ line });
  };
  
	mainMouseMoveHandler = e => {
		let {line} = this.state;
		if(line){
		  if(React.isValidElement(line)) {
		    console.log('object');
		    let newLine = React.cloneElement(line, {
		      endPt: `${e.nativeEvent.offsetX},${e.nativeEvent.offsetY}`
		    })
		    this.setState({line: newLine});
		  }
		};
	};


	renderShape =()=>{

	}
	
	render() {
		let { shapes } = this.state;

		// let nodes = shapes.map((item)=>(item));
		// nodes.push(line);
		
		return (
			<Content
				ref="mainContent"
				onClick={this.mainClickHandler}
				onMouseDown={this.mainMouseDownHandler}
				onMouseMove={this.mainMouseMoveHandler}
				style={{ background: "#fff", position: "relative" }}
			>
			{shapes}
				{/* <div style={{ position: "absolute", width:'100%' ,height:"100%" }}>{shapes}</div>
				<div style={{ position: "absolute", width:'100%' ,height:"100%" }}>{line}</div> */}
			</Content>
		);
	}
}

export default MainContent;
