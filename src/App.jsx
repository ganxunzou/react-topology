import React from "react";
import { Layout, Menu, Breadcrumb, Icon, Collapse } from "antd";
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const Panel = Collapse.Panel;

import MainContent from './MainContent';
import {GraphicsType} from './constant';


import style from "./App.css";
console.log('style', style, style.container)

export default class App extends React.Component {
	constructor(props){
		super();
		this.state={
			selKey: GraphicsType.Diamond,
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
		let {selKey, isLock} = this.state;
		if(key == selKey){
			this.setState({selKey: key, isLock: !isLock})
		}
		else{
			this.setState({selKey: key, isLock: false});
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
							defaultSelectedKeys={["1"]}
							defaultOpenKeys={["sub1"]}
							style={{ height: "100%", borderRight: 0 }}
							onClick={this.menuClickHandler}
						>
							<SubMenu
								key="sub1"
								title={
									<span>
										<Icon type="appstore-o" />基本图形
									</span>
								}
							>
								<Menu.Item key={GraphicsType.Diamond}> 菱形 {this.getSelLockNode(GraphicsType.Diamond)}</Menu.Item>
								<Menu.Item key={GraphicsType.Rect}> 矩形 {this.getSelLockNode(GraphicsType.Rect)}</Menu.Item>
								<Menu.Item key={GraphicsType.Ellipse}> 椭圆 {this.getSelLockNode(GraphicsType.Ellipse)}</Menu.Item>
								<Menu.Item key={GraphicsType.Triangle}> 三角形 {this.getSelLockNode(GraphicsType.Triangle)}</Menu.Item>
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
