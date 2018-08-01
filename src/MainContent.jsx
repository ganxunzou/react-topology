import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Layout, Collapse, Breadcrumb, Button, Input } from "antd";
const { Content, Sider } = Layout;
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;

import { ShapeType, SelType } from "./constant";
import { DiamondSvg, EllipseSvg, RectSvg, TriangleSvg } from "react-resize-svg";
import PolylineSvg from "./components/PolylineSvg";
import ShapeAtt from "./components/ShapeAtt";
import {
	RectShapeVo,
	DiamondShapeVo,
	TriangleShapeVo,
	EllipseShapeVo,
	LineVo
} from "./vo";

import style from "./MainContent.less";
import FileUtils from "./utils/FileUtils";
import EagleEye from "./components/EagleEye";
import ResizeSensor from "css-element-queries/src/ResizeSensor";

class MainContent extends Component {
	constructor(props) {
		super();
		this.state = {
			shapeVos: {}, // key: uuid , value ShapeVo
			lineVos: {}, // key: uuid ,value lineVo
			tempLineVo: null,
			selectedShapeVos: [], // 选中图形列表
			scaleRatio: 1, // 缩放比例,
			mainContentLeft: 0,
			mainContentTop: 0,
			mainContentWidth: 0,
			mainContentHeight: 0
		};

		this.startMoveMainContent = false;
		this.lastMouseX = 0;
		this.lastMouseY = 0;
	}

	windowKeyDownHandler = e => {
		
		// delete
		if(event.keyCode == 46) {
			let {shapeVos, selectedShapeVos, lineVos } = this.state;
			if(selectedShapeVos != null) {

				selectedShapeVos.forEach(shapeVo => {
					if (shapeVos.hasOwnProperty(shapeVo.id)) {
						delete shapeVos[shapeVo.id];

						for (const lId in lineVos) {
							const lineVo = lineVos[lId];
							if(lineVo.fromNode.id == shapeVo.id || lineVo.toNode.id == shapeVo.id) 
							{
								delete lineVos[lId];
							}
						}
					}
				});

				selectedShapeVos = []; //
				this.setState({shapeVos, lineVos, selectedShapeVos});
			}
		}
	};


	windowMouseUpHandler = e => {
		this.startMoveMainContent = false;
	};

	windowMouseDownHandler = e => {
		let { isLock } = this.props;
		if (
			!isLock &&
			ReactDOM.findDOMNode(this.refs.mainContent) == e.target
		) {
			this.lastMouseX = e.clientX;
			this.lastMouseY = e.clientY;
			this.startMoveMainContent = true;
			return;
		}
	};

	windowMouseMoveHandler = e => {
		let { isLock } = this.props;
		if (!isLock && this.startMoveMainContent) {
			this.doMainContentMouseMoveHandler(e);
			return;
		}
	};

	doMainContentMouseMoveHandler = e => {
		let currMouseX = e.clientX;
		let currMouseY = e.clientY;

		let deltaX = currMouseX - this.lastMouseX;
		let deltaY = currMouseY - this.lastMouseY;

		let { mainContentLeft, mainContentTop } = this.state;

		mainContentLeft = mainContentLeft + deltaX;
		mainContentTop = mainContentTop + deltaY;
		this.setState({ mainContentLeft, mainContentTop });

		this.lastMouseX = e.clientX;
		this.lastMouseY = e.clientY;
	};

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
		let { scaleRatio, mainContentLeft } = this.state;
		console.log(scaleRatio, mainContentLeft);
		console.log(e.target.getBoundingClientRect());
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
		this.startMoveMainContent = false;

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

	svgChangeActionHandler = (isAction, shapeVo, isLock) => {
		if (isLock) return;

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
						rx={shapeVo.rx}
						ry={shapeVo.ry}
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
				lineVo={lineVo}
				key={lineVo.id}
				startPt={`${sX},${sY}`}
				endPt={`${toX},${toY}`}
			/>
		);
	};

	renderTempLine = () => {
		let { tempLineVo } = this.state;
		if (!tempLineVo || !tempLineVo.fromNode) return null;

		// let sX = tempLineVo.fromNode.x;
		// let sY = tempLineVo.fromNode.y;
		// if (tempLineVo.tempToX == 0) tempLineVo.tempToX = sX;
		// if (tempLineVo.tempToY == 0) tempLineVo.tempToY = sY;

		// let tX = tempLineVo.toNode ? tempLineVo.toNode.x : tempLineVo.tempToX;
		// let tY = tempLineVo.toNode ? tempLineVo.toNode.y : tempLineVo.tempToY;

		// let pts = [sX, sY, tX, tY];
		// //this.calcLineStartAndEndPoint(tempLineVo);

		// pts = pts || [sX, sY, tX, tY];
		//React.cloneElement(line,{startPt: `${sX},${sY}`, endPt: `${tempLineVo.tempToX},${tempLineVo.tempToY}`});
		return <PolylineSvg lineVo={tempLineVo} key={tempLineVo.id} />;
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

	saveDataClickHandler = () => {
		let { shapeVos, lineVos } = this.state;
		let retData = {
			shapeVos,
			lineVos
		};

		let content = JSON.stringify(retData);
		var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
		FileUtils.saveFile(blob, "react-topology.json");
	};

	loadDataClickHandler = () => {
		FileUtils.loadJsonFile(str => {
			if (str) {
				let obj = JSON.parse(str);

				let { shapeVos, lineVos } = obj;
				let fromLineVos = this.formatLineVos(shapeVos, lineVos);
				this.setState({ shapeVos, lineVos: fromLineVos });
			}
		});
	};

	formatLineVos = (shapeVos, lineVos) => {
		for (const id in lineVos) {
			let lineVo = lineVos[id];
			lineVo.fromNode = shapeVos[lineVo.fromNode.id];
			lineVo.toNode = shapeVos[lineVo.toNode.id];
		}
		return lineVos;
	};

	componentWillMount(){
		window.addEventListener("mouseup",this.windowMouseUpHandler);
		window.addEventListener("mousemove",this.windowMouseMoveHandler);
		window.addEventListener("mousedown",this.windowMouseDownHandler);
		window.addEventListener("keydown",this.windowKeyDownHandler);
	}

	componentWillUnmount(){
		window.removeEventListener("mouseup",this.windowMouseUpHandler);
		window.removeEventListener("mousemove",this.windowMouseMoveHandler);
		window.removeEventListener("mousedown",this.windowMouseDownHandler);
		window.removeEventListener("keydown",this.windowKeyDownHandler);
	}

	componentDidMount() {
		let mainContent = ReactDOM.findDOMNode(this.refs.mainContent);
		new ResizeSensor(mainContent, () => {
			let mW = mainContent.getBoundingClientRect().width;
			let mH = mainContent.getBoundingClientRect().width;
			console.log("mainContent resize", mW, mH);
			this.setState({ mainContentWidth: mW, mainContentHeight: mH });
		});
	}

	mainWheelHandler = event => {
		// console.log(event.nativeEvent);
		event.preventDefault();
		// console.log(event.deltaMode, event.deltaX, event.deltaY)
		let { scaleRatio } = this.state;
		if (event.deltaY > 0) {
			scaleRatio -= 0.1;
			this.setState({ scaleRatio });
		} else {
			scaleRatio += 0.1;
			this.setState({ scaleRatio });
		}
		// let mainContent = ReactDOM.findDOMNode(this.refs.mainContent);
		// let mW = mainContent.getBoundingClientRect().width;
	};

	viewPortMoveHandler = (deltaX, deltaY) => {
		let { mainContentLeft, mainContentTop } = this.state;

		mainContentLeft = mainContentLeft + deltaX;
		mainContentTop = mainContentTop + deltaY;
		this.setState({ mainContentLeft, mainContentTop });
	};

	render() {
		let nodes = this.renderNodes();
		let {
			selectedShapeVos,
			shapeVos,
			scaleRatio,
			mainContentLeft,
			mainContentTop,
			mainContentWidth,
			mainContentHeight
		} = this.state;
		let selectedShapeVo =
			selectedShapeVos.length > 0 &&
			selectedShapeVos[selectedShapeVos.length - 1];

		//console.log(	{transform: `scale(${scaleRatio})`});
		return (
			<Layout
				style={{ padding: "0 24px 24px" }}
				className={style.mainContainer}
			>
				<ButtonGroup style={{ padding: "10px 0" }}>
					<Button type="primary" onClick={this.loadDataClickHandler}>
						加载数据
					</Button>
					<Button type="primary" onClick={this.saveDataClickHandler}>
						保存数据
					</Button>
				</ButtonGroup>
				<Layout>
					<Content
						style={{
							background: "#ccc",
							position: "relative",
							overflow: "hidden"
						}}
					>
						<div
							style={{
								background: "#fff",
								position: "absolute",
								width: "100%",
								height: "100%",
								transform: `scale(${scaleRatio})`,
								transition: "transform 0.3s",
								left: `${mainContentLeft}px`,
								top: `${mainContentTop}px`
							}}
							ref="mainContent"
							onClick={this.mainClickHandler}
							onMouseDown={this.mainMouseDownHandler}
							onMouseMove={this.mainMouseMoveHandler}
							onMouseUp={this.mainMouseUpHandler}
							onWheel={this.mainWheelHandler}
						>
							{nodes}
						</div>
						<EagleEye
							shapeVos={shapeVos}
							mainContentLeft={mainContentLeft}
							mainContentTop={mainContentTop}
							mainContentWidth={mainContentWidth}
							mainContentHeight={mainContentHeight}
							scaleRatio={scaleRatio}
							onViewPortMove={this.viewPortMoveHandler}
						/>
					</Content>
					<Sider width={200} theme="dark">
						<Collapse
							defaultActiveKey={["1"]}
							style={{ height: "100%", borderRadius: 0 }}
						>
							<Panel
								header="属性"
								key="1"
								style={{ height: "100%" }}
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
