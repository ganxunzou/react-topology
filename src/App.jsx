import React from "react";
import { Layout, Menu, Icon } from "antd";
const { Header, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import MainContent from './MainContent';
import {ShapeType, LineType, SelType} from './constant';
import ElementQueries from 'css-element-queries/src/ElementQueries';
ElementQueries.listen();
ElementQueries.init();
import style from "./App.less";

export default class App extends React.Component {
	constructor(props){
		super();
		this.state={
			selType: SelType.SHAPE, 
			selKey: ShapeType.Diamond,
			isLock: false
		}
	}

	getSelLockNode=(key)=>{
		let {selKey, isLock} = this.state;
		if(selKey == key) {
			return isLock ? <Icon type="lock" /> : <Icon type="unlock" />;
		}
		else {
			return undefined;
		}
	}
	
	menuClickHandler=( {item, key, keyPath })=>{
		
		let selType = keyPath[1];
		let {selKey, isLock} = this.state;
		if(key == selKey){
			this.setState({selKey: key, isLock: !isLock, selType})
		}
		else{
			this.setState({selKey: key, isLock: false, selType});
		}
	}


	render() {
		let {selKey, isLock, selType} = this.state;
		return (
			<Layout>
				<Header>
					<div className={style.logo}>
						SVG Topology
					</div>
					<Menu
						theme="dark"
						mode="horizontal"
						defaultSelectedKeys={["1"]}
						style={{ lineHeight: "64px" }}
					>
						<Menu.Item key="1">nav 1</Menu.Item>
						<Menu.Item key="2">nav 2</Menu.Item>
						<Menu.Item key="3">nav 3</Menu.Item>
					</Menu>
				</Header>
				<Layout style={{height:`800px`}}>
					<Sider width={200} style={{ background: "#fff" }}>
						<Menu theme="dark"
							mode="inline"
							inlineCollapsed={true}
							defaultSelectedKeys={[ShapeType.Diamond]}
							defaultOpenKeys={[SelType.SHAPE, SelType.LINE]}
							style={{ height: "100%", borderRight: 0 }}
							onClick={this.menuClickHandler}
						>
							<SubMenu
								key={SelType.SHAPE}
								title={
									<span>
										<Icon type="appstore-o" />基本图形
									</span>
								}
							>
								<Menu.Item key={ShapeType.Diamond}> 菱形 {this.getSelLockNode(ShapeType.Diamond)}</Menu.Item>
								<Menu.Item key={ShapeType.Rect}> 矩形 {this.getSelLockNode(ShapeType.Rect)}</Menu.Item>
								<Menu.Item key={ShapeType.Ellipse}> 椭圆 {this.getSelLockNode(ShapeType.Ellipse)}</Menu.Item>
								<Menu.Item key={ShapeType.Triangle}> 三角形 {this.getSelLockNode(ShapeType.Triangle)}</Menu.Item>
							</SubMenu>
							<SubMenu
								key={SelType.LINE}
								title={
									<span>
										<Icon type="appstore-o" />连线
									</span>
								}
							>
								<Menu.Item key={LineType.Straight}> 直线 {this.getSelLockNode(LineType.Straight)}</Menu.Item>
								<Menu.Item key={LineType.Polyline1}> 一级折线 {this.getSelLockNode(LineType.Polyline1)}</Menu.Item>
								<Menu.Item key={LineType.Polyline2}> 二级折现 {this.getSelLockNode(LineType.Polyline2)}</Menu.Item>
							</SubMenu>
						</Menu>
					</Sider>
					<MainContent
							selKey={selKey}
							selType={selType}
							isLock={isLock}
						>
						</MainContent>
				</Layout>
			</Layout>
		);
	}
}
