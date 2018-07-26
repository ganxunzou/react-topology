import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuidv1 from 'uuid/v1';
import { Layout,} from "antd";
const { Content } = Layout;

import {GraphicsType} from './constant';
import Style from './MainContent.css';

console.log('>>', Style, Style.mainContainer)

import {DiamondSvg, EllipseSvg , RectSvg, TriangleSvg} from 'react-resize-svg';

class MainContent extends Component {
  constructor(props){
    super();
    this.state={
      shapes: []
    }
  }

  createShape=(key, top , left)=>{
    let {shapes} = this.state;
    switch (key) {
      case GraphicsType.Rect:
        shapes.push(<RectSvg key={uuidv1()} width="100" height="100" top={top} left={left} style={{ fill: "red" }} />);
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
  render() {
    let {shapes} = this.state;
    return (
      <Content ref="mainContent" onClick={this.mainClickHandler} style={{background:'#fff', position: 'relative'}} >
        {shapes}
      </Content>
    );
  }
}

export default MainContent;