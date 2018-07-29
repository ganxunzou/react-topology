import classnames from "classnames";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import injectStyle from "./injectCss";
import { SelType } from "../constant";

let ActionType = {
	None: 0,
	LeftResize: 1,
	TopResize: 2,
	RightResize: 3,
	BottomResize: 4,
	TopLeftResize: 5,
	BottomLeftResize: 6,
	TopRightResize: 7,
	BottomRightResize: 8,
	Move: 9
};

injectStyle();

class ResizeSvg extends Component {
	constructor(props) {
		super();

		let { width, height, top, left } = props;
		width = parseInt(width);
		height = parseInt(height);
		top = parseInt(top);
		left = parseInt(left);

		this.state = {
			padding: 8, // padding
			style: {
				left: left || 0,
				top: top || 0,
				w: width || 100,
				h: height || 100,
				width: `${width || 100}px`,
				height: `${height || 100}px`
			},
			isAction: true,
			shapeVo: props.shapeVo,
			deafultSvgContainerStyle: "resize-svg-svg-container-dynamic",
		};
		this.currentAction = ActionType.None;
		this.isClickMove = false; // 一次单击过程中是否有移动

		this.lastMouseX = 0;
		this.lastMouseY = 0;
		window.addEventListener("mouseup", this.mouseUpHandler.bind(this));
		window.addEventListener("mousemove", this.mouseMoveHandler.bind(this));

		// this.shapeVo = props.shapeVo;
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps && 'shapeVo' in nextProps) {
			let {x,y, w, h} = nextProps.shapeVo;
			let style = {
				left: x,
				top: y,
				w: w,
				h: h,
				width: `${w}px`,
				height: `${h}px`
			}
			this.setState({shapeVo: nextProps.shapeVo, style});
			
		}
	}
	
	mouseUpHandler(e) {
		this.currentAction = ActionType.None;

		this.setState({deafultSvgContainerStyle: 'resize-svg-svg-container-dynamic'});
	}

	mouseMoveHandler(e) {
		if (e.target == ReactDOM.findDOMNode(this.refs.moveRect)) {
			this.setState({deafultSvgContainerStyle: 'resize-svg-svg-container'});
		}
		
		let currMouseX = e.clientX;
		let currMouseY = e.clientY;

		let deltaX = currMouseX - this.lastMouseX;
		let deltaY = currMouseY - this.lastMouseY;
		//console.log(currMouseX, deltaX, this.lastMouseX);

		this.applyMouseMoveAction(deltaX, deltaY, e);

		// this.lastMouseX = event.pageX;
		// this.lastMouseY = event.pageY;
		this.lastMouseX = currMouseX;
		this.lastMouseY = currMouseY;
	}

	mouseDownHandler(actionType) {
		this.currentAction = actionType;
		
	}

	applyMouseMoveAction(deltaX, deltaY, e) {
		let deltaTop = 0;
		let deltaLeft = 0;
		let deltaWidth = 0;
		let deltaHeight = 0;

		let currentAction = this.currentAction;
		if (
			currentAction == ActionType.RightResize ||
			currentAction == ActionType.TopRightResize ||
			currentAction == ActionType.BottomRightResize
		) {
			deltaWidth = deltaX;
		}

		if (
			currentAction == ActionType.LeftResize ||
			currentAction == ActionType.TopLeftResize ||
			currentAction == ActionType.BottomLeftResize
		) {
			deltaWidth = -deltaX;
			deltaLeft = deltaX;
		}

		if (
			currentAction == ActionType.BottomResize ||
			currentAction == ActionType.BottomLeftResize ||
			currentAction == ActionType.BottomRightResize
		) {
			deltaHeight = deltaY;
		}

		if (
			currentAction == ActionType.TopResize ||
			currentAction == ActionType.TopLeftResize ||
			currentAction == ActionType.TopRightResize
		) {
			deltaHeight = -deltaY;
			deltaTop = deltaY;
		}

		if (this.currentAction == ActionType.Move) {
			deltaLeft = deltaX;
			deltaTop = deltaY;
		}

		if (deltaLeft > 0 || deltaTop > 0) {
			this.isClickMove = true;
		}

		this.updatePosition(deltaLeft, deltaTop, e);
		this.updateSize(deltaWidth, deltaHeight);

	}

	updatePosition(deltaLeft, deltaTop, e) {
		let { style, shapeVo} = this.state;
		let { left, top } = style;

		let newStyle = Object.assign({}, style, {
			left: left + deltaLeft,
			top: top + deltaTop
		});

		shapeVo.x = newStyle.left;
		shapeVo.y = newStyle.top;
		this.setState({ style: newStyle });

		if (e.target == ReactDOM.findDOMNode(this.refs.moveRect)) {
			
			let { onSvgMouseMove } = this.props;
			if (onSvgMouseMove) {
				onSvgMouseMove(shapeVo);
			}
		}
	}

	updateSize(deltaWidth, deltaHeight) {
		let { padding, style, shapeVo } = this.state;
		let { w, h } = style;

		let newWidth = w + deltaWidth;
		let newHeight = h + deltaHeight;

		// Don't allow a too small size.
		let minumalSize = padding * 2;
		if (newWidth < minumalSize) {
			newWidth = minumalSize;
		}
		if (newHeight < minumalSize) {
			newHeight = minumalSize;
		}

		let newStyle = Object.assign({}, style, {
			w: newWidth,
			h: newHeight,
			width: `${newWidth}px`,
			height: `${newHeight}px`
		});

		shapeVo.w = newWidth;
		shapeVo.h = newHeight;
		this.setState({ style: newStyle });
	}

	moveRectClickHandler = () => {
		if (!this.isClickMove) {
			let { isAction, shapeVo } = this.state;
			this.setState({ isAction: !isAction });

			let { onSvgChangeAction } = this.props;

			onSvgChangeAction && onSvgChangeAction(!isAction, shapeVo);
		}

		this.isClickMove = false;
	};

	render() {
		let { padding, style, isAction, deafultSvgContainerStyle } = this.state;
		let { w, h } = style;
		let {
			width,
			height,
			top,
			left,
			children,
			// custom classname
			svgContainerStyle,
			showLineStyle,
			showCircleStyle,
			triggerLineStyle,
			triggerCircleStyle,
			triggerMoveRectStyle,
			shapeVo,
			selType,
			isLock,
			key,
			onSvgMouseMove,
			onSvgChangeAction,
			...otherProps
		} = this.props;

		// console.log(shapeVo, selType, isLock, key, onSvgMouseMove, onSvgClick);

		const childrenWithProps =
			children &&
			React.Children.map(children, child => {
				return React.cloneElement(child, {
					padding,
					contentWidth: w - padding * 2,
					contentHeight: h - padding * 2,
					width: w,
					height: h,
					...otherProps
				});
			});

		let isDrawLine = isLock && selType == SelType.LINE;
		return (
			<svg
				ref="svgContainer"
				className={classnames(
					`${deafultSvgContainerStyle}`,
					svgContainerStyle
				)}
				style={this.state.style}
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
			>
				{childrenWithProps}
				{/* 四条显示的边框：虚线 */}
				<g
					id="gShowLine"
					className={classnames(
						"resize-svg-show-line",
						showLineStyle
					)}
					style={{ stroke: isDrawLine ? "green" : "" }}
				>
					<line
						x1={padding}
						y1={padding}
						x2={`${w - padding}px`}
						y2={padding}
					/>
					<line
						x1={`${w - padding}px`}
						y1={padding}
						x2={`${w - padding}px`}
						y2={`${h - padding}px`}
					/>
					<line
						x1={`${w - padding}px`}
						y1={`${h - padding}px`}
						x2={padding}
						y2={`${h - padding}px`}
					/>
					<line
						x1={padding}
						y1={`${h - padding}px`}
						x2={padding}
						y2={padding}
					/>
				</g>
				<g
					id="gShowCircle"
					className={classnames(
						"resize-svg-show-circle",
						showCircleStyle
					)}
					style={{ display: !isDrawLine && isAction ? "" : "none" }}
				>
					<circle cx={padding} cy={padding} r={padding / 2} />
					<circle
						cx={`${w - padding}px`}
						cy={padding}
						r={padding / 2}
					/>
					<circle
						cx={`${w - padding}px`}
						cy={`${h - padding}px`}
						r={padding / 2}
					/>
					<circle
						cx={padding}
						cy={`${h - padding}px`}
						r={padding / 2}
					/>
				</g>

				<g id="gMoveRect" onClick={this.moveRectClickHandler}>
					<rect
						ref="moveRect"
						id={shapeVo.id}
						x={padding}
						y={padding}
						width={`${w - padding * 2}px`}
						height={`${h - padding * 2}px`}
						className={classnames(
							"resize-svg-trigger-move-rect",
							triggerMoveRectStyle
						)}
						style={{ cursor: isDrawLine ? "default" : "move" }}
						onMouseDown={() => {
							!isDrawLine &&
								this.mouseDownHandler(ActionType.Move);
						}}
					/>
				</g>

				<g id="gActionLine" style={{ display: isAction ? "" : "none" }}>
					<line
						x1={padding}
						y1={padding}
						x2={`${w - padding}px`}
						y2={padding}
						style={{ cursor: "n-resize" }}
						className={classnames(
							"resize-svg-trigger-line",
							triggerLineStyle
						)}
						onMouseDown={() => {
							this.mouseDownHandler(ActionType.TopResize);
						}}
					/>
					<line
						x1={`${w - padding}px`}
						y1={padding}
						x2={`${w - padding}px`}
						y2={`${h - padding}px`}
						style={{ cursor: "e-resize" }}
						className={classnames(
							"resize-svg-trigger-line",
							triggerLineStyle
						)}
						onMouseDown={() => {
							this.mouseDownHandler(ActionType.RightResize);
						}}
					/>
					<line
						x1={`${w - padding}px`}
						y1={`${h - padding}px`}
						x2={padding}
						y2={`${h - padding}px`}
						style={{ cursor: "s-resize" }}
						className={classnames(
							"resize-svg-trigger-line",
							triggerLineStyle
						)}
						onMouseDown={() => {
							this.mouseDownHandler(ActionType.BottomResize);
						}}
					/>
					<line
						x1={padding}
						y1={`${h - padding}px`}
						x2={padding}
						y2={padding}
						style={{ cursor: "w-resize" }}
						className={classnames(
							"resize-svg-trigger-line",
							triggerLineStyle
						)}
						onMouseDown={() => {
							this.mouseDownHandler(ActionType.LeftResize);
						}}
					/>
				</g>

				<g
					id="gActionCircle"
					style={{ display: isAction ? "" : "none" }}
				>
					<circle
						cx={padding}
						cy={padding}
						r={padding}
						style={{ cursor: "nw-resize" }}
						className={classnames(
							"resize-svg-trigger-circle",
							triggerCircleStyle
						)}
						onMouseDown={() => {
							this.mouseDownHandler(ActionType.TopLeftResize);
						}}
					/>
					<circle
						cx={`${w - padding}px`}
						cy={padding}
						r={padding}
						style={{ cursor: "ne-resize" }}
						className={classnames(
							"resize-svg-trigger-circle",
							triggerCircleStyle
						)}
						onMouseDown={() => {
							this.mouseDownHandler(ActionType.TopRightResize);
						}}
					/>
					<circle
						cx={`${w - padding}px`}
						cy={`${h - padding}px`}
						r={padding}
						style={{ cursor: "se-resize" }}
						className={classnames(
							"resize-svg-trigger-circle",
							triggerCircleStyle
						)}
						onMouseDown={() => {
							this.mouseDownHandler(ActionType.BottomRightResize);
						}}
					/>
					<circle
						cx={padding}
						cy={`${h - padding}px`}
						r={padding}
						style={{ cursor: "sw-resize" }}
						className={classnames(
							"resize-svg-trigger-circle",
							triggerCircleStyle
						)}
						onMouseDown={() => {
							this.mouseDownHandler(ActionType.BottomLeftResize);
						}}
					/>
				</g>
			</svg>
		);
	}
}

ResizeSvg.propTypes = {
	// width: PropTypes.number,
	// height: PropTypes.number,
};

ResizeSvg.defaultProps = {
	// width: 100,
	// height: 100,
	// padding: 8
};

export default ResizeSvg;
