import React, { Component } from "react";
import { Form, Input } from "antd";
const FormItem = Form.Item;

const formItemLayout = {
	labelCol: {
		sm: { span: 8 }
	},
	wrapperCol: {
		sm: { span: 16 }
	}
};

class ShapeAtt extends Component {
	constructor(props) {
		super();
		this.state = {
			shapeVo: null
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ shapeVo: nextProps.shapeVo });
	}

  attChangeHandler=(e, attObj)=>{
		let value = null;
		if(attObj.dataType == 'int') {
			value = parseInt(e.target.value);
		}

		let {shapeVo} = this.state;
		shapeVo[attObj.att] = value;
		this.setState({shapeVo});

    let {onShapeAttChange} = this.props;
    onShapeAttChange && onShapeAttChange(shapeVo);
  }

  renderAtt=()=>{
		let {shapeVo} = this.state;
		if(!shapeVo) return;

		let attNodes = [];
		
		shapeVo.iterationAtt.forEach(attObj => {
			attNodes.push(
        <FormItem {...formItemLayout} key={attObj.att} label={attObj.att}>
					<Input value={shapeVo[attObj.att]} onChange={(e)=>{this.attChangeHandler(e, attObj)}}/>
				</FormItem>
      );
		});

    return attNodes;
  }
	render() {
    let nodes = this.renderAtt();
		return (
			<div>
        {nodes}
			</div>
		);
	}
}

export default ShapeAtt;
