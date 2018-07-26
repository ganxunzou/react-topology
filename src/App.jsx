import React from "react";
import { Layout, Menu, Breadcrumb, Icon, Collapse } from "antd";
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const Panel = Collapse.Panel;

import MainContent from './MainContent';
import {ShapeType, LineType} from './constant';

// 选中类型
const SelType ={
	SHAPE: "1", // 图形
	LINE: "2"   // 线条
}

import style from "./App.less";
console.log('style', style, style.container)

export default class App extends React.Component {
	constructor(props){
		super();
		this.state={
			selType: SelType.SHAPE, 
			selKey: ShapeType.Diamond,
			isLock: false
		}
	}

	getSelLockNode=(key, selTypea)=>{
		let {selKey, isLock, selType} = this.state;
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
		let {selKey, isLock} = this.state;
		return (
			<Layout>
				<Header>
					<div className={style.container} >
						HHh
					</div>
					<Menu
						theme="dark"
						mode="horizontal"
						defaultSelectedKeys={["2"]}
						style={{ lineHeight: "64px" }}
					>
						<Menu.Item key="1">nav 1</Menu.Item>
						<Menu.Item key="2">nav 2</Menu.Item>
						<Menu.Item key="3">nav 3</Menu.Item>
					</Menu>
				</Header>
				<Layout style={{height:`600px`}}>
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
								<Menu.Item key={ShapeType.Diamond}> 菱形 {this.getSelLockNode(ShapeType.Diamond, SelType.SHAPE)}</Menu.Item>
								<Menu.Item key={ShapeType.Rect}> 矩形 {this.getSelLockNode(ShapeType.Rect, SelType.SHAPE)}</Menu.Item>
								<Menu.Item key={ShapeType.Ellipse}> 椭圆 {this.getSelLockNode(ShapeType.Ellipse, SelType.SHAPE)}</Menu.Item>
								<Menu.Item key={ShapeType.Triangle}> 三角形 {this.getSelLockNode(ShapeType.Triangle, SelType.SHAPE)}</Menu.Item>
							</SubMenu>
							<SubMenu
								key={SelType.LINE}
								title={
									<span>
										<Icon type="appstore-o" />连线
									</span>
								}
							>
								<Menu.Item key={LineType.Straight}> 直线 {this.getSelLockNode(LineType.Straight, SelType.LINE)}</Menu.Item>
								<Menu.Item key={LineType.Polyline1}> 一级折线 {this.getSelLockNode(LineType.Polyline1, SelType.LINE)}</Menu.Item>
								<Menu.Item key={LineType.Polyline2}> 二级折现 {this.getSelLockNode(LineType.Polyline2, SelType.LINE)}</Menu.Item>
							</SubMenu>
						</Menu>
					</Sider>
					<Layout style={{ padding: "0 24px 24px" }}>
						<Breadcrumb style={{ margin: "16px 0" }}>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
							<Breadcrumb.Item>List</Breadcrumb.Item>
							<Breadcrumb.Item>App</Breadcrumb.Item>
						</Breadcrumb>
						<MainContent
							selKey={selKey}
							isLock={isLock}
						>
						</MainContent>
					</Layout>
					<Sider width={200} style={{ background: "#fff" }}>
						<Collapse defaultActiveKey={['1']} style={{height: '100%', borderRadius: 0}}>
							<Panel header="属性" key="1" style={{height: '100%'}}>
								<p>HelloWorld</p>
							</Panel>
						</Collapse>
					</Sider>
				</Layout>
			</Layout>
		);
	}
}
