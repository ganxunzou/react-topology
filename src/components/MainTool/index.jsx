import React, { Component } from 'react';
import style from './index.less';
import {Icon} from 'antd';
import { MainContentAction } from "../../constant";

class MainTool extends Component {
  constructor(props){
    super();
    this.state={
      homeColor: '#d81e06',
      mainAction: MainContentAction.Move,
    };
  }

  homeClickHandler=()=>{
   
    let {onHomeClick} = this.props;
    onHomeClick && onHomeClick();
  }

  editHandler=(e)=>{
    let {onEditClick} = this.props;
    onEditClick && onEditClick();
    this.setState({mainAction: MainContentAction.Edit});
  }

  moveHandler=(e)=>{
    let {onMoveClick} = this.props;
    onMoveClick && onMoveClick();

    this.setState({mainAction: MainContentAction.Move});
  }

  render() {
    let {homeColor, mainAction} = this.state;
    let isEdit = mainAction == MainContentAction.Edit;
    return (
      <div className={style.mainToolsContainer}>
        <Icon type="home" style={{ fontSize: 24, color: homeColor, paddingLeft: '5px' }} 
          onMouseOver={()=>{this.setState({homeColor: '#08c'})}}
          onMouseOut={()=>{this.setState({homeColor: '#d81e06'})}}
          onClick={this.homeClickHandler}/>
        <Icon type="edit" style={{ fontSize: 24, color: isEdit ? '#08c' : '#d81e06', paddingLeft: '5px' }}
          onClick={this.editHandler}/>
        <Icon type="arrows-alt" style={{ fontSize: 24,  color: !isEdit ? '#08c' : '#d81e06', paddingLeft: '5px' }}
          onClick={this.moveHandler}/>
      </div>
    );
  }
}

export default MainTool;