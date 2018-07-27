import React, { Component } from "react";
import ReactDOM from "react-dom";
import uuidv1 from "uuid/v1";
import { Layout } from "antd";
const { Content } = Layout;

import { ShapeType, LineType, SelType } from "./constant";
import { DiamondSvg, EllipseSvg, RectSvg, TriangleSvg } from "react-resize-svg";
import PolylineSvg from "./components/PolylineSvg";
import {
	RectShapeVo,
	DiamondShapeVo,
	TriangleShapeVo,
	EllipseShapeVo
} from "./vo";

class MainContent extends Component {
	constructor(props) {
		super();
		this.state = {
			shapeVos: {}, // key: uuid , value ShapeVo
			line: undefined
		};
	}

	mainClickHandler = e => {
		console.log(e.target);
		console.log(e.nativeEvent);

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
		if (e.target != ReactDOM.findDOMNode(this.refs.mainContent)) return;
	};

	mainMouseMoveHandler = e => {
		let { line } = this.state;
		if (line) {
			if (React.isValidElement(line)) {
				let newLine = React.cloneElement(line, {
					endPt: `${e.nativeEvent.offsetX},${e.nativeEvent.offsetY}`
				});
				this.setState({ line: newLine });
			}
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

	dealCreateLineVo = (selKey, top, left) =>{

	}

	renderShape = () => {
		let nodes = [];
		let { shapeVos } = this.state;
		for (let key in shapeVos) {
			let shapeNode = this.createShapeByVo(shapeVos[key]);
			shapeNode && nodes.push(shapeNode);
		}
		return nodes;
	};

	createShapeByVo = shapeVo => {
		let { x, y } = shapeVo;
		let { isLock, selType } = this.props;
		switch (shapeVo.shapeType) {
			case ShapeType.Rect:
				return (
					<RectSvg
						key={shapeVo.id}
						width="100"
						height="100"
						top={y}
						left={x}
						style={{ fill: "red" }}
						shapeVo={shapeVo}
						isLock={isLock}
						selType={selType}
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
					/>
				);
				break;
		}
	};

	render() {
		let shapeNodes = this.renderShape();
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
				{shapeNodes}
				{/* <div style={{ position: "absolute", width:'100%' ,height:"100%" }}>{shapes}</div>
				<div style={{ position: "absolute", width:'100%' ,height:"100%" }}>{line}</div> */}
			</Content>
		);
	}
}

export default MainContent;
