export const ShapeType = {
	Diamond: "s1",		// 菱形
	Ellipse: "s2",   // 椭圆
	Triangle: "s3",  // 三角形
	Rect: "s4"				// 矩形
}

export const LineType ={
	Straight: "l1",  // 直线
	Polyline1: "l2",  // 一级折线
	Polyline2: "l3",  // 一级折线
}

// 选中类型
export const SelType ={
	SHAPE: "1", // 图形
	LINE: "2"   // 线条
}

// 象限
export const Quadrant = {
	One: '1',
	Two: '2',
	Three: '3',
	Four: '4',
	OneFour: '14',
	TwoThree: '23',
}

// 鹰眼 宽度
export const EagleEyeW = 150;
// 鹰眼 高度
export const EagleEyeH = 150;

// 图形填充
export const ShapePadding = 8;
// 图形边框
export const ShapeBorder = 8;

// 两个图形之间相同坐标间距，例如：Shape1.x - Shape2.x > ShapeMinSpacing
export const ShapeMinSpacing = 20;

export const MainContentAction = {
	Move: '1', // 移动
	Edit: '2', // 编辑
}
