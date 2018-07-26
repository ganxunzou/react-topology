import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuidv1 from 'uuid/v1';
import { Layout,} from "antd";
const { Content } = Layout;

import {ShapeType} from './constant';
//import Style from './MainContent.css';

//console.log('>>', Style, Style.mainContainer)

import {DiamondSvg, EllipseSvg , RectSvg, TriangleSvg} from 'react-resize-svg';
import PolylineSvg from './components/PolylineSvg';

class MainContent extends Component {
  constructor(props){
    super();
    this.state={
      shapes: [],
      lines: []
    }
  }

  createShape=(key, top , left)=>{
    let {shapes} = this.state;
    console.log('key', key);
    switch (key) {
      case ShapeType.Rect:
        shapes.push(<RectSvg key={uuidv1()} width="100" height="100" top={top} left={left} style={{ fill: "red" }} />);
        break;
      
      case ShapeType.Diamond:
        shapes.push(<DiamondSvg key={uuidv1()} width="100" height="100" top={top} left={left} style={{ fill: "red" }} />);
        break;
      
      
      case ShapeType.Ellipse:
        shapes.push(<EllipseSvg key={uuidv1()} width="100" height="100" top={top} left={left} style={{ fill: "red" }} />);
        break;

      case ShapeType.Triangle:
        shapes.push(<TriangleSvg key={uuidv1()} width="100" height="100" top={top} left={left} style={{ fill: "red" }} />);
        break;

      default:
        break;
    }

    this.setState({shapes})
  }

  mainClickHandler=(e)=>{
    if(e.target != ReactDOM.findDOMNode(this.refs.mainContent))
      return;

    console.log(e.nativeEvent.offsetY, e.nativeEvent.offsetX);
    let {selKey, isLock} = this.props;
    isLock && this.createShape(selKey,e.nativeEvent.offsetY, e.nativeEvent.offsetX);
  }

  renderShape=()=>{
    let {shapes} = this.state;
    shapes.map((item)=>{

    })
  }
  mainMouseDownHandler=(e)=>{
    if(e.target != ReactDOM.findDOMNode(this.refs.mainContent))
      return;

//     let {lines} = this.state;
// //e.nativeEvent.offsetY, e.nativeEvent.offsetX
//      this.psvg = <PolylineSvg startPt={`${e.nativeEvent.offsetX},${e.nativeEvent.offsetY}`} />
//      lines.push(psvg);
//      this.setState({lines});

  }
  mainMouseMoveHandler=(e)=>{
    // this.psvg.endPt = "10,10";

  }

  render() {
    let {shapes, lines} = this.state;
    
    return (
      <Content ref="mainContent" 
        onClick={this.mainClickHandler} 
        onMouseDown={this.mainMouseDownHandler}
        onMouseMove={this.mainMouseMoveHandler}
        style={{background:'#fff', position: 'relative'}} >
        {shapes}
       
      </Content>
    );
  }
}

export default MainContent;