import React, { Component } from "react";
import ReactDOM from "react-dom";
import style from "./index.less";

import { EagleEyeW, EagleEyeH } from "../../constant";
class EagleEye extends Component {
	constructor(props) {
    super();

    let {viewPortW, viewPortH, viewPortLeft, viewPortTop} = props.mainContentWidth && this.calcViewPortPosition();
		this.state = {
			shapeVos: props.shapeVos,
			mainContentLeft: props.mainContentLeft || 0,
			mainContentTop: props.mainContentTop || 0,
			mainContentWidth: props.mainContentWidth || 0,
			mainContentHeight: props.mainContentHeight || 0,
      scaleRatio: props.scaleRatio || 1,
      viewPortW: viewPortW || 0, 
      viewPortH: viewPortH || 0, 
      viewPortLeft: viewPortLeft || 0, 
      viewPortTop: viewPortTop || 0
    };
    
    window.addEventListener("mouseup", this.windowMouseUpHandler.bind(this));
		window.addEventListener("mousemove",this.windowMouseMoveHandler.bind(this));
		window.addEventListener("mousedown",this.windowMouseDownHandler.bind(this));
    
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.startMove = false;
  }

  windowMouseUpHandler=(e)=>{
    this.startMove = false;
  }

  windowMouseMoveHandler=(e)=>{
    if(!this.startMove)
      return;

    let currMouseX = e.clientX;
		let currMouseY = e.clientY;

		let deltaX = currMouseX - this.lastMouseX;
		let deltaY = currMouseY - this.lastMouseY;

    
		let { viewPortLeft, viewPortTop } = this.state;

    viewPortLeft += deltaX;
    viewPortTop += deltaY;
    
    let {onViewPortMove} = this.props;
    if(onViewPortMove) {
      onViewPortMove(-this.convertHorizontalPxReverse(deltaX), -this.convertVerticalPxReverse(deltaY));
    }

		this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    this.setState({viewPortLeft, viewPortTop})
  }

  windowMouseDownHandler=(e)=>{
    if(e.target == ReactDOM.findDOMNode(this.refs.viewPortDiv)) {
      this.lastMouseX = e.clientX;
			this.lastMouseY = e.clientY;
      this.startMove = true;
    }
  }

	componentWillReceiveProps(nextProps) {
		if (nextProps && "shapeVos" in nextProps) {
			this.setState({ shapeVos: nextProps.shapeVos });
		}

		if (nextProps && "mainContentLeft" in nextProps) {
			this.setState({ mainContentLeft: nextProps.mainContentLeft });
		}
		if (nextProps && "mainContentTop" in nextProps) {
			this.setState({ mainContentTop: nextProps.mainContentTop });
		}
		if (nextProps && "mainContentWidth" in nextProps) {
      this.setState({ mainContentWidth: nextProps.mainContentWidth });
      this.updateViewPort();
		}

		if (nextProps && "mainContentHeight" in nextProps) {
			this.setState({ mainContentHeight: nextProps.mainContentHeight });
		}

		if (nextProps && "scaleRatio" in nextProps) {
      this.setState({ scaleRatio: nextProps.scaleRatio });
      this.updateViewPort();
		}
	}

	renderShape = () => {
		// 不缩放情况下：
		// mainContent 中 1px 对应 1px * EagleEyeW / mainContentWidth = ?px

		// 缩放情况下：
		// mainContent 中的 1px 对应 1px * EagleEyeW /( mainContentWidth * scaleRatio) =?px

		let { shapeVos } = this.state;
		let shapeNodes = [];
		for (const id in shapeVos) {
			let shapeVo = shapeVos[id];
			let sX = this.convertHorizontalPx(shapeVo.x);
			let sY = this.convertVerticalPx(shapeVo.y);
			let sW = this.convertHorizontalPx(shapeVo.w);
			let sH = this.convertVerticalPx(shapeVo.h);

			shapeNodes.push(
				<rect
					className={style.eagleEyeShape} key={id}
					style={{ width: sW, height: sH, x: sX, y: sY }}
				/>
			);
    }
    
    return shapeNodes;
	};

  updateViewPort=()=>{
    let {viewPortW, viewPortH, viewPortLeft, viewPortTop} = this.calcViewPortPosition();
    this.setState({viewPortW, viewPortH, viewPortLeft, viewPortTop});
  }

	calcViewPortPosition = () => {
		let {
			mainContentWidth,
			mainContentHeight,
			mainContentLeft,
			mainContentTop,
			scaleRatio
    } = this.state;
    
		let maxWidth = mainContentWidth * scaleRatio;
		let eagleEyeRatio = mainContentWidth / maxWidth;
		let viewPortW = EagleEyeW * eagleEyeRatio; // 鹰眼中视口宽度
		let viewPortH = EagleEyeH * eagleEyeRatio; // 鹰眼中视口宽度

		let mainX =
			(mainContentWidth - mainContentWidth * scaleRatio) / 2 +
			mainContentLeft; // 从中心缩放，距离左上角原点橫坐标
		let mainY =
			(mainContentHeight - mainContentHeight * scaleRatio) / 2 +
			mainContentTop; //从中心缩放，距离左上角原点纵坐标

		// 不缩放情况下：
		// mainContent 中 1px 对应 1px * EagleEyeW / mainContentWidth = ?px
		// 缩放情况下：
		// mainContent 中的 1px 对应 1px * EagleEyeW /( mainContentWidth * scaleRatio) =?px
		let viewPortLeft = -this.convertHorizontalPx(mainX);
		let viewPortTop = -this.convertVerticalPx(mainY);

		return {viewPortW, viewPortH, viewPortLeft, viewPortTop};
	};

  // 将 mianContent 移动的px，转成viewport移动的px
	convertHorizontalPx = hPx => {
		// 不缩放情况下横向PX转换：
		// mainContent 中 1px 对应 1px * EagleEyeW / mainContentWidth = ?px
		// 缩放情况下横向PX转换：
		// mainContent 中的 1px 对应 1px * EagleEyeW /( mainContentWidth * scaleRatio) =?px
    let { mainContentWidth, scaleRatio } = this.state;
		return (hPx * EagleEyeW) / (mainContentWidth * scaleRatio);
  };
  
	convertVerticalPx = vPx => {
		// 不缩放情况下横向PX转换：
		// mainContent 中 1px 对应 1px * EagleEyeW / mainContentWidth = ?px
		// 缩放情况下横向PX转换：
		// mainContent 中的 1px 对应 1px * EagleEyeW /( mainContentWidth * scaleRatio) =?px
		let { mainContentHeight, scaleRatio } = this.state;
		return (vPx * EagleEyeH) / (mainContentHeight * scaleRatio);
  };
  
  // 将viewport移动的px，转成mainContent移动的px
  convertHorizontalPxReverse=(hPx)=>{
    let { mainContentWidth, scaleRatio } = this.state;
    return hPx * (mainContentWidth * scaleRatio) / EagleEyeW;
  }

  // 将viewport移动的px，转成mainContent移动的px
  convertVerticalPxReverse=(vPx)=>{
    let { mainContentHeight, scaleRatio } = this.state;
    return vPx * (mainContentHeight * scaleRatio) / EagleEyeH;
  }

	render() {
		let nodes = this.renderShape();
		let {
			viewPortW,
			viewPortH,
			viewPortLeft,
			viewPortTop
     } = this.state;
		return (
			<div
				className={style.eagleEye}
				style={{
					width: `${EagleEyeW}px`,
					height: `${EagleEyeH}px`
				}}
			>
				<svg
					style={{
						width: `${EagleEyeW}px`,
						height: `${EagleEyeH}px`
					}}
				>
					{nodes}
				</svg>
				<div ref="viewPortDiv"
					className={style.viewPort}
					style={{
						position: "absolute",
						width: `${viewPortW}px`,
						height: `${viewPortH}px`,
						left: `${viewPortLeft}px`,
            top: `${viewPortTop}px`,
					}}
				/>
			</div>
		);
	}
}

export default EagleEye;
