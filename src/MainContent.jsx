import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Layout, Collapse, Breadcrumb, Button, Input, Icon } from "antd";
const { Content, Sider } = Layout;
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;

import { ShapeType, SelType, MainContentAction } from "./constant";
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
import MainTool from "./components/MainTool";

class MainContent extends Component {
	constructor(props) {
		super();
		this.state = {
			shapeVos: {}, // key: uuid , value ShapeVo
			lineVos: {}, // key: uuid ,value lineVo
			tempLineVo: null,
			selectedShapeVoArr: [], // 选中图形列表，为了排序
			selectedShapeVos: {}, // 选中图形列表，key，value为了方便查找。
			scaleRatio: 1, // 缩放比例,
			mainContentLeft: 0,
			mainContentTop: 0,
			mainContentWidth: 0,
			mainContentHeight: 0,
			startFrameSelectionRect: {
				x: 0,
				y: 0,
				tX: 0,
				tY: 0
			}
		};

		this.startMoveMainContent = false; // 开始移动
		this.startFrameSelection = false; // 开始框选
		this.mainAction = MainContentAction.Move;
		this.lastMouseX = 0;
		this.lastMouseY = 0;
	}

	windowKeyDownHandler = e => {
		if (event.keyCode == 46) {
			// delete key
			this.deleteSelectedShape();
		} else if (event.keyCode == 27) {
			// ESC key
			this.changeAllShapeActionIsNone();
		}
	};

	deleteSelectedShape = () => {
		let { shapeVos, selectedShapeVoArr, lineVos } = this.state;
		if (selectedShapeVoArr != null) {
			selectedShapeVoArr.forEach(shapeVo => {
				if (shapeVos.hasOwnProperty(shapeVo.id)) {
					delete shapeVos[shapeVo.id];

					for (const lId in lineVos) {
						const lineVo = lineVos[lId];
						if (
							lineVo.fromNode.id == shapeVo.id ||
							lineVo.toNode.id == shapeVo.id
						) {
							delete lineVos[lId];
						}
					}
				}
			});

			selectedShapeVoArr = []; //
			this.setState({ shapeVos, lineVos, selectedShapeVoArr });
		}
	};

	changeAllShapeActionIsNone = () => {
		if (this.mainAction == MainContentAction.Edit) {
			let { shapeVos } = this.state;
			for (const key in shapeVos) {
				shapeVos[key].isAction = false;
			}

			this.setState({
				shapeVos,
				selectedShapeVo: {},
				selectedShapeVoArr: []
			});
		}
	};

	windowMouseUpHandler = e => {
		this.startMoveMainContent = false;
		this.startFrameSelection = false;
		this.setState({
			startFrameSelectionRect: { x: 0, y: 0, tX: 0, tY: 0 }
		});
	};

	windowMouseDownHandler = e => {
		let { isLock } = this.props;

		if (
			!isLock &&
			ReactDOM.findDOMNode(this.refs.mainContent) == e.target
		) {
			if (this.mainAction == MainContentAction.Edit) {
				this.lastMouseX = e.offsetX;
				this.lastMouseY = e.offsetY;
				this.startFrameSelection = true;
			} else if (this.mainAction == MainContentAction.Move) {
				this.lastMouseX = e.clientX;
				this.lastMouseY = e.clientY;
				this.startMoveMainContent = true;
			}
		}
	};

	windowMouseMoveHandler = e => {
		// let { isLock } = this.props;
		if (
			this.startMoveMainContent &&
			this.mainAction == MainContentAction.Move
		) {
			this.doMainContentMouseMoveHandler(e);
		} else if (
			this.startFrameSelection &&
			this.mainAction == MainContentAction.Edit
		) {
			this.mainContentEditHandler(e);
		}
	};

	mainContentEditHandler = e => {
		if (e.target != ReactDOM.findDOMNode(this.refs.mainContent)) return;

		let { shapeVos, startFrameSelectionRect } = this.state;
		let currMouseX = e.offsetX;
		let currMouseY = e.offsetY;

		let deltaX = currMouseX - this.lastMouseX;
		let deltaY = currMouseY - this.lastMouseY;

		startFrameSelectionRect = {
			x: this.lastMouseX,
			y: this.lastMouseY,
			tX: currMouseX,
			tY: currMouseY
		};

		if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
			var isChange = false;
			for (const id in shapeVos) {
				let shapeVo = shapeVos[id];
				if (this.judgeShapeInFrameSelectionRec(startFrameSelectionRect,shapeVo))
					if (!shapeVos[id].isAction) {
						isChange = true;
						shapeVos[id].isAction = true;
					}
			}
			isChange && this.setState({ shapeVos });
			// shapeVos.forEach(shapeVo => {
			// 	// if(shapeVo.x > this.lastMouseX && shapeVo.y < )
			// });
		}

		this.setState({ startFrameSelectionRect });
	};

	judgeShapeInFrameSelectionRec=(startFrameSelectionRect, shapeVo) => {
		let {x, y, tX, tY} = startFrameSelectionRect;
		console.log(	shapeVo.x > tX ,
			shapeVo.y > tY ,
			shapeVo.x + shapeVo.w < x ,
			shapeVo.y + shapeVo.h < y);
		if(x < tX) {
			// 向右框选
			if (
				shapeVo.x > x &&
				shapeVo.y > y &&
				shapeVo.x + shapeVo.w < tX &&
				shapeVo.y + shapeVo.h < tY
			){
				return true;
			} else{
				return false;
			}
		} else {
			
			// 向左框选
			if (
				shapeVo.x > tX &&
				shapeVo.y > tY &&
				shapeVo.x + shapeVo.w < x &&
				shapeVo.y + shapeVo.h < y
			){
				return true;
			} else{
				return false;
			}
		}
		
	}



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
		console.log(e.target == ReactDOM.findDOMNode(this.refs.mainContent));
		let { scaleRatio, mainContentLeft } = this.state;
		if (e.target != ReactDOM.findDOMNode(this.refs.mainContent)) {
			return;
		}

		let { selKey, isLock, selType } = this.props;
		if (
			isLock &&
			selType == SelType.SHAPE &&
			this.mainAction != MainContentAction.Edit
		) {
			this.createShape(
				selKey,
				e.nativeEvent.offsetY,
				e.nativeEvent.offsetX
			);
		}
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

	createShape = (selKey, top, left) => {
		this.dealCreateShapeVo(selKey, top, left);
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

			this.addSelectedShape(shapeVo);
		}
	};

	// 添加一个选中图形
	addSelectedShape = shapeVo => {
		//
		shapeVo.isAction = true;

		let { selectedShapeVoArr, selectedShapeVos } = this.state;
		if (selectedShapeVos[shapeVo.id]) return;

		selectedShapeVoArr.push(shapeVo);
		selectedShapeVos[shapeVo.id] = shapeVo;

		this.setState({ selectedShapeVos, selectedShapeVoArr });
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

	svgChangeActionHandler = shapeVo => {
		let { isLock, selType } = this.props;
		if (isLock && selType == SelType.LINE) return;

		let { isAction } = shapeVo;
		if (isAction) {
			//	this.setState({selectedShapeVo: shapeVo})	;
			this.changeSelectedShapeOrder(shapeVo);
		} else {
			console.log("removeSelectedShape");
			this.removeSelectedShape(shapeVo);
			// this.setState({selectedShapeVo: null})
		}
	};

	changeSelectedShapeOrder = shapeVo => {
		let { selectedShapeVoArr } = this.state;
		let removeIndex = -1;
		for (let i = 0; i < selectedShapeVoArr.length; i++) {
			if (shapeVo.id == selectedShapeVoArr[i].id) {
				// 删除
				removeIndex = i;
			}
		}
		if (removeIndex != -1) {
			selectedShapeVoArr.splice(removeIndex, 1);
		}

		selectedShapeVoArr.push(shapeVo);

		this.setState({ selectedShapeVoArr });
	};

	removeSelectedShape = shapeVo => {
		let { selectedShapeVoArr } = this.state;
		let removeIndex = -1;
		for (let i = 0; i < selectedShapeVoArr.length; i++) {
			if (shapeVo.id == selectedShapeVoArr[i].id) {
				// 删除
				removeIndex = i;
			}
		}
		if (removeIndex != -1) {
			selectedShapeVoArr.splice(removeIndex, 1);
		}
		this.setState({ selectedShapeVoArr });
	};
	createShapeByVo = shapeVo => {
		let {scaleRatio} = this.state;
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
						scaleRatio={scaleRatio}
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

	componentWillMount() {
		window.addEventListener("mouseup", this.windowMouseUpHandler);
		window.addEventListener("mousemove", this.windowMouseMoveHandler);
		window.addEventListener("mousedown", this.windowMouseDownHandler);
		window.addEventListener("keydown", this.windowKeyDownHandler);
	}

	componentWillUnmount() {
		window.removeEventListener("mouseup", this.windowMouseUpHandler);
		window.removeEventListener("mousemove", this.windowMouseMoveHandler);
		window.removeEventListener("mousedown", this.windowMouseDownHandler);
		window.removeEventListener("keydown", this.windowKeyDownHandler);
	}

	componentDidMount() {
		let mainContent = ReactDOM.findDOMNode(this.refs.mainContent);
		new ResizeSensor(mainContent, () => {
			let mW = mainContent.getBoundingClientRect().width;
			let mH = mainContent.getBoundingClientRect().height;
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

	mainToolHomeClickHandler = () => {
		this.setState({
			mainContentLeft: 0,
			mainContentTop: 0,
			scaleRatio: 1
		});
	};

	convertScalePx = px => {
		let { scaleRatio } = this.state;
		// 1px = px * scaleRatio
		return px;
	};

	getFrameSelectionData = () => {
		let { startFrameSelectionRect } = this.state;
		let d = `M ${startFrameSelectionRect.x} ${startFrameSelectionRect.y} 
		H ${startFrameSelectionRect.tX} 
		V ${startFrameSelectionRect.tY}
		H ${startFrameSelectionRect.x}
		V ${startFrameSelectionRect.y}`;

		//console.log(d);
		return d;
	};

	render() {
		let nodes = this.renderNodes();
		let {
			selectedShapeVoArr,
			shapeVos,
			scaleRatio,
			mainContentLeft,
			mainContentTop,
			mainContentWidth,
			mainContentHeight
		} = this.state;

		// 获取最后一个选中图形对象，给属性窗口
		let selectedShapeVo =
			selectedShapeVoArr.length > 0 &&
			selectedShapeVoArr[selectedShapeVoArr.length - 1];

		let frameSelectionData = this.getFrameSelectionData();

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

							<svg
								style={{
									position: "absolute",
									width: "100%",
									height: "100%",
									pointerEvents: "none",
									display: this.startFrameSelection
										? ""
										: "none"
								}}
							>
								<path
									d={frameSelectionData}
									style={{
										fill: "none",
										stroke: "red",
										strokeDasharray: "5.5",
										strokeWidth: 1
									}}
								/>
							</svg>
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
						<MainTool
							onHomeClick={this.mainToolHomeClickHandler}
							onEditClick={() => {
								this.mainAction = MainContentAction.Edit;
								this.props.onChangeLock(false);
							}}
							onMoveClick={() => {
								this.mainAction = MainContentAction.Move;
								this.props.onChangeLock(false);
							}}
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
