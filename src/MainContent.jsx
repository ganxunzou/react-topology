import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Layout } from "antd";
const { Content } = Layout;

import { ShapeType, LineType, SelType } from "./constant";
import { DiamondSvg, EllipseSvg, RectSvg, TriangleSvg } from "react-resize-svg";
import PolylineSvg from "./components/PolylineSvg";
import {
	RectShapeVo,
	DiamondShapeVo,
	TriangleShapeVo,
	EllipseShapeVo,
	LineVo
} from "./vo";

class MainContent extends Component {
	constructor(props) {
		super();
		this.state = {
			shapeVos: {}, // key: uuid , value ShapeVo
			lineVos: {}, // key: uuid ,value lineVo
			tempLineVo: null
		};
	}

	// 根据位置获取对应的ShapeVo
	getShapeVoByArea=(x, y)=>{
		let {shapeVos} = this.state;
		let retVo = null;
		for(let key in shapeVos){
			let shapeVo = shapeVos[key];
			//console.log(x > shapeVo.x , x< (shapeVo.x + shapeVo.width) , y > shapeVo.y , y < shapeVo.y + shapeVo.height);
			if(x > shapeVo.x && x< (shapeVo.x + shapeVo.w) && y > shapeVo.y && y < shapeVo.y + shapeVo.h ) {
				retVo = shapeVo;
				break;
			}
		}
		return retVo;
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
		
		let id = e.target.id;
		let { shapeVos, tempLineVo } = this.state;
		let { isLock, selType } = this.props;

		if (selType == SelType.LINE && isLock) {
			// 鼠标在图形上 && 图形已经注册

			if (
				e.target.className.baseVal == "resize-svg-trigger-move-rect" &&
				shapeVos[id] &&
				tempLineVo == null
			) {
				let tempLineVo = new LineVo();
				tempLineVo.fromNode = shapeVos[id];
				// 绘制线
				this.setState({ tempLineVo });
			}
		}
	};

	mainMouseMoveHandler = e => {
		let { tempLineVo, shapeVos } = this.state;
		let { isLock, selType } = this.props;
		if (selType == SelType.LINE && isLock) {

			if (tempLineVo) {
				let id = e.target.id;
				if ( e.target.className.baseVal == "resize-svg-trigger-move-rect" && shapeVos[id] ){
					tempLineVo.tempToX = shapeVos[id].x;
					tempLineVo.tempToY = shapeVos[id].y;	
				} 
				else
				{
					tempLineVo.tempToX = e.nativeEvent.offsetX;
					tempLineVo.tempToY = e.nativeEvent.offsetY;
				}

				this.setState({ tempLineVo });
			}
		}
	};

	mainMouseUpHandler = e => {
		// let shapeVo = this.getShapeVoByArea(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		
		let id = e.target.id;
		let { tempLineVo, shapeVos } = this.state;
		if ( tempLineVo && e.target.className.baseVal == "resize-svg-trigger-move-rect" && shapeVos[id] ){
		
			tempLineVo.toNode = shapeVos[id];
			this.createLineVo(tempLineVo);
		}
		this.setState({ tempLineVo: null });
	};

	createLineVo = lineVo => {
		let { lineVos } = this.state;

		if (lineVos && !lineVos[lineVo.id]) {
			lineVos[lineVo.id] = lineVo;

			this.setState({ lineVos });
		}
	};

	createShape = (selType, selKey, top, left) => {
		if (selType == SelType.SHAPE) {
			this.dealCreateShapeVo(selKey, top, left);
		} else if (selType == SelType.LINE) {
		}
	};

	dealCreateShapeVo = (selKey, top, left) => {
		let { shapeVos } = this.state;

		let shapeVo = null;
		switch (selKey) {
			case ShapeType.Rect:
				shapeVo = new RectShapeVo();
				break;

			case ShapeType.Diamond:
				shapeVo = new DiamondShapeVo();
				break;

			case ShapeType.Ellipse:
				shapeVo = new EllipseShapeVo();
				break;

			case ShapeType.Triangle:
				shapeVo = new TriangleShapeVo();
				break;
		}

		if (shapeVo && !shapeVos.hasOwnProperty(shapeVo.id)) {
			shapeVo.x = left;
			shapeVo.y = top;

			shapeVos[shapeVo.id] = shapeVo;
			this.setState({ shapeVos });
		}
	};

	renderShape = () => {
		let nodes = [];
		let { shapeVos } = this.state;
		for (let key in shapeVos) {
			let shapeNode = this.createShapeByVo(shapeVos[key]);
			shapeNode && nodes.push(shapeNode);
		}
		return nodes;
	};

	svgMouseMoveHandler=(shapeVo)=>{
		this.forceUpdate(); 
	}

	createShapeByVo = shapeVo => {
		let { x, y } = shapeVo;
		let { isLock, selType } = this.props;
		switch (shapeVo.shapeType) {
			case ShapeType.Rect:
				return (
					<RectSvg
						id={shapeVo.id}
						key={shapeVo.id}
						width="100"
						height="100"
						top={y}
						left={x}
						style={{ fill: "red" }}
						shapeVo={shapeVo}
						isLock={isLock}
						selType={selType}
						onSvgMouseMove={this.svgMouseMoveHandler}
					/>
				);
				break;

			case ShapeType.Diamond:
				return (
					<DiamondSvg
						key={shapeVo.id}
						width="100"
						height="100"
						top={y}
						left={x}
						style={{ fill: "red" }}
						shapeVo={shapeVo}
						isLock={isLock}
						selType={selType}						
						onSvgMouseMove={this.svgMouseMoveHandler}
					/>
				);
				break;

			case ShapeType.Ellipse:
				return (
					<EllipseSvg
						key={shapeVo.id}
						width="100"
						height="100"
						top={y}
						left={x}
						style={{ fill: "red" }}
						shapeVo={shapeVo}
						isLock={isLock}
						selType={selType}
						onSvgMouseMove={this.svgMouseMoveHandler}
					/>
				);
				break;

			case ShapeType.Triangle:
				return (
					<TriangleSvg
						key={shapeVo.id}
						width="100"
						height="100"
						top={y}
						left={x}
						style={{ fill: "red" }}
						shapeVo={shapeVo}
						isLock={isLock}
						selType={selType}
						onSvgMouseMove={this.svgMouseMoveHandler}
					/>
				);
				break;
		}
	};

	renderNodes = () => {
		let nodes = [];
		let shapeNodes = this.renderShape();
		let tempLine = this.renderTempLine();
		let lineNodes = this.renderLine();

		if (shapeNodes) {
			nodes = nodes.concat(shapeNodes);
		}

		if (tempLine) {
			nodes.push(tempLine);
		}

		if(lineNodes){
			nodes.push(lineNodes);
		}

		return nodes;
	};

	renderLine = () => {
		let nodes = [];
		let { lineVos } = this.state;
		for (let key in lineVos) {
			let lineNode = this.createLineByVo(lineVos[key]);
			lineNode && nodes.push(lineNode);
		}
		return nodes;
	};

	createLineByVo=(lineVo)=>{
		let sX = lineVo.fromNode.x;
		let sY = lineVo.fromNode.y;
		let toX = lineVo.toNode.x;
		let toY = lineVo.toNode.y;
		return (
			<PolylineSvg
				key={lineVo.id}
				startPt={`${sX},${sY}`}
				endPt={`${toX},${toY}`}
			/>
		);
	}

	renderTempLine = () => {
		let { tempLineVo } = this.state;
		if (!tempLineVo || !tempLineVo.fromNode) return null;

		let sX = tempLineVo.fromNode.x;
		let sY = tempLineVo.fromNode.y;
		if(tempLineVo.tempToX == 0)
			tempLineVo.tempToX = sX;
		
			if(tempLineVo.tempToY == 0)
			tempLineVo.tempToY = sY;
			
		//React.cloneElement(line,{startPt: `${sX},${sY}`, endPt: `${tempLineVo.tempToX},${tempLineVo.tempToY}`});
		return (
			<PolylineSvg
				key={tempLineVo.id}
				startPt={`${sX},${sY}`}
				endPt={`${tempLineVo.tempToX},${tempLineVo.tempToY}`}
			/>
		);
	};

	calcLinePosition=(tempLineVo)=>{
		// 以发起图形中心圆点建立坐标，4个象限
	}

	quadrantOne=()=>{

	}

	quadrantTwo=()=>{
		
	}

	quadrantThree=()=>{
		
	}

	quadrantFour=()=>{
		
	}

	render() {
		let nodes = this.renderNodes();
		return (
			<Content
				ref="mainContent"
				onClick={this.mainClickHandler}
				onMouseDown={this.mainMouseDownHandler}
				onMouseMove={this.mainMouseMoveHandler}
				onMouseUp={this.mainMouseUpHandler}
				style={{ background: "#fff", position: "relative", overflow:'auto' }}
			>
				{nodes}
			</Content>
		);
	}
}

export default MainContent;
