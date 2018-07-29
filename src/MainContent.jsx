import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Layout, Collapse, Breadcrumb, Button } from "antd";
const { Content, Sider } = Layout;
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;

import { ShapeType, LineType, SelType, Quadrant } from "./constant";
import { DiamondSvg, EllipseSvg, RectSvg, TriangleSvg } from "react-resize-svg";
import PolylineSvg from "./components/PolylineSvg";
import ShapeAtt from "./components/ShapeAtt";
import {
	RectShapeVo,
	DiamondShapeVo,
	TriangleShapeVo,
	EllipseShapeVo,
	LineVo,
	Point
} from "./vo";

import style from './MainContent.less';

class MainContent extends Component {
	constructor(props) {
		super();
		this.state = {
			shapeVos: {}, // key: uuid , value ShapeVo
			lineVos: {}, // key: uuid ,value lineVo
			tempLineVo: null,
			selectedShapeVos: [] // 选中图形列表
		};
	}

	// 根据位置获取对应的ShapeVo
	getShapeVoByArea = (x, y) => {
		let { shapeVos } = this.state;
		let retVo = null;
		for (let key in shapeVos) {
			let shapeVo = shapeVos[key];
			//console.log(x > shapeVo.x , x< (shapeVo.x + shapeVo.width) , y > shapeVo.y , y < shapeVo.y + shapeVo.height);
			if (
				x > shapeVo.x &&
				x < shapeVo.x + shapeVo.w &&
				y > shapeVo.y &&
				y < shapeVo.y + shapeVo.h
			) {
				retVo = shapeVo;
				break;
			}
		}
		return retVo;
	};

	mainClickHandler = e => {
		if (e.target != ReactDOM.findDOMNode(this.refs.mainContent)) {
			// 重置
			// this.setState({selectedShapeVo: null})
			return;
		}

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
		//let id = e.target.id;

		let { isLock, selType } = this.props;
		if (selType == SelType.LINE && isLock) {
			this.createTempLineVo(e.target.id, e);
		}
	};

	createTempLineVo = (id, e) => {
		let { shapeVos, tempLineVo } = this.state;
		let { selKey } = this.props; // 选中的线条类型

		// 鼠标在图形上 && 图形已经注册
		if (
			e.target.className.baseVal == "resize-svg-trigger-move-rect" &&
			shapeVos[id] &&
			tempLineVo == null
		) {
			let tempLineVo = new LineVo();
			tempLineVo.lineType = selKey;
			tempLineVo.fromNode = shapeVos[id];
			// 绘制线
			this.setState({ tempLineVo });
		}
	};

	mainMouseMoveHandler = e => {
		let { isLock, selType } = this.props;
		if (selType == SelType.LINE && isLock) {
			this.tempLineMouseMove(e.target.id, e);
		}
	};

	tempLineMouseMove = (id, e) => {
		let { tempLineVo, shapeVos } = this.state;
		if (tempLineVo) {
			if (
				e.target.className.baseVal == "resize-svg-trigger-move-rect" &&
				shapeVos[id]
			) {
				tempLineVo.toNode = shapeVos[id];
				// tempLineVo.tempToX = shapeVos[id].x;
				// tempLineVo.tempToY = shapeVos[id].y;
			} else {
				tempLineVo.toNode = null;
				tempLineVo.tempToX = e.nativeEvent.offsetX;
				tempLineVo.tempToY = e.nativeEvent.offsetY;
			}

			this.setState({ tempLineVo });
		}
	};

	mainMouseUpHandler = e => {
		// let shapeVo = this.getShapeVoByArea(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		let id = e.target.id;
		let { tempLineVo, shapeVos } = this.state;
		if (
			tempLineVo &&
			e.target.className.baseVal == "resize-svg-trigger-move-rect" &&
			shapeVos[id]
		) {
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
		let { shapeVos, selectedShapeVos } = this.state;

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
			selectedShapeVos.push(shapeVo);
			this.setState({ shapeVos, selectedShapeVos });
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

	svgMouseMoveHandler = shapeVo => {
		this.forceUpdate();
	};

	svgChangeActionHandler = (isAction, shapeVo) => {
		let { selectedShapeVos } = this.state;
		if (isAction) {
			//	this.setState({selectedShapeVo: shapeVo})	;
			this.changeSelectedShapeOrder(shapeVo);
		} else {
			this.removeSelectedShape(shapeVo);
			// this.setState({selectedShapeVo: null})
		}
	};

	changeSelectedShapeOrder = shapeVo => {
		let { selectedShapeVos } = this.state;
		let removeIndex = -1;
		for (let i = 0; i < selectedShapeVos.length; i++) {
			if (shapeVo.id == selectedShapeVos[i].id) {
				// 删除
				removeIndex = i;
			}
		}
		if (removeIndex != -1) {
			selectedShapeVos.splice(removeIndex, 1);
		}

		selectedShapeVos.push(shapeVo);
		this.setState({ selectedShapeVos });
	};

	removeSelectedShape = shapeVo => {
		let { selectedShapeVos } = this.state;
		let removeIndex = -1;
		for (let i = 0; i < selectedShapeVos.length; i++) {
			if (shapeVo.id == selectedShapeVos[i].id) {
				// 删除
				removeIndex = i;
			}
		}
		if (removeIndex != -1) {
			selectedShapeVos.splice(removeIndex, 1);
		}
		this.setState({ selectedShapeVos });
	};

	renderSelectedShapeAttribute = () => {};

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
						onSvgChangeAction={this.svgChangeActionHandler}
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
						onSvgChangeAction={this.svgChangeActionHandler}
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
						onSvgChangeAction={this.svgChangeActionHandler}
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
						onSvgChangeAction={this.svgChangeActionHandler}
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

		if (lineNodes) {
			nodes.push(lineNodes);
		}

		return nodes;
	};

	renderLine = () => {
		let nodes = [];
		let { lineVos } = this.state;
		for (let key in lineVos) {
			let lineNode = this.createLineSvgByVo(lineVos[key]);
			lineNode && nodes.push(lineNode);
		}
		return nodes;
	};

	createLineSvgByVo = lineVo => {
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
	};

	renderTempLine = () => {
		let { tempLineVo } = this.state;
		if (!tempLineVo || !tempLineVo.fromNode) return null;

		let sX = tempLineVo.fromNode.x;
		let sY = tempLineVo.fromNode.y;
		if (tempLineVo.tempToX == 0) tempLineVo.tempToX = sX;
		if (tempLineVo.tempToY == 0) tempLineVo.tempToY = sY;

		let tX = tempLineVo.toNode ? tempLineVo.toNode.x : tempLineVo.tempToX;
		let tY = tempLineVo.toNode ? tempLineVo.toNode.y : tempLineVo.tempToY;

		let pts = [sX, sY, tX, tY];
		//this.calcLineStartAndEndPoint(tempLineVo);

		pts = pts || [sX, sY, tX, tY];
		//React.cloneElement(line,{startPt: `${sX},${sY}`, endPt: `${tempLineVo.tempToX},${tempLineVo.tempToY}`});
		return (
			<PolylineSvg
				key={tempLineVo.id}
				startPt={`${pts[0]},${pts[1]}`}
				endPt={`${pts[2]},${pts[3]}`}
			/>
		);
	};

	calcLineStartAndEndPoint = lineVo => {
		// 坐标：从左向右：X递增；从上到下：Y递增。

		// 发起图形坐标中心原点
		let fOriginX = lineVo.fromNode.x + lineVo.fromNode.w / 2;
		let fOriginY = lineVo.fromNode.y + lineVo.fromNode.h / 2;

		// 目标图形坐标左上角原点
		let tOriginX = lineVo.toNode
			? lineVo.toNode.x + lineVo.toNode.w / 2
			: lineVo.tempToX;
		let tOriginY = lineVo.toNode
			? lineVo.toNode.y + lineVo.toNode.h / 2
			: lineVo.tempToY;

		let fX, fY, tX, tY;

		if (tOriginX >= fOriginX) {
			// 第1，4象限
			fx = fOriginX + lineVo.fromNode.w / 2;
			if (tOriginY >= fOriginY) {
				//4象限
			}
			f;
		}

		if (tOriginX < fOriginX) {
			// 第1，3象限
			fx = fOriginX - lineVo.fromNode.w / 2;
		}
	};

	shapeAttChangeHandler = shapeVo => {
		// console.log('shapeVo>>>>', shapeVo.x);
		// let {shapeVos} = this.state;
		// // shapeVos[shapeVo.id] =shapeVo;
		// shapeVos[shapeVo.id].x = 10;
		// this.setState({shapeVos})
		// console.log(shapeVo.x, shapeVo);
		this.forceUpdate();
	};
	render() {
		let nodes = this.renderNodes();
		let { selectedShapeVos } = this.state;
		let selectedShapeVo =
			selectedShapeVos.length > 0 &&
			selectedShapeVos[selectedShapeVos.length - 1];

		return (
			<Layout style={{ padding: "0 24px 24px" }}>
				<ButtonGroup style={{ padding: "10px 0" }}>
					<Button type="primary">加载数据</Button>
					<Button type="primary">保存数据</Button>
				</ButtonGroup>
				<Layout>
					<Content
						ref="mainContent"
						onClick={this.mainClickHandler}
						onMouseDown={this.mainMouseDownHandler}
						onMouseMove={this.mainMouseMoveHandler}
						onMouseUp={this.mainMouseUpHandler}
						style={{
							background: "#fff",
							position: "relative",
							overflow: "auto"
						}}
					>
						{nodes}
					</Content>
					<Sider width={200} theme="dark">
						<Collapse 
							defaultActiveKey={["1"]}
							style={{ height: "100%", borderRadius: 0 }}
						>
							<Panel
								header="属性"
								key="1"
								style={{ height: "100%"}}
							>
								<ShapeAtt
									shapeVo={selectedShapeVo}
									onShapeAttChange={
										this.shapeAttChangeHandler
									}
								/>
							</Panel>
						</Collapse>
					</Sider>
				</Layout>
			</Layout>
		);
	}
}

export default MainContent;
