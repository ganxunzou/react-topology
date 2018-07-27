import {ShapeType, lineType} from './constant';
import uuidv1 from "uuid/v1";
/**
 * 基类VO
 */
class BaseVo {
  constructor(id){
    this.id = id || uuidv1();
  }
}

/**
 * 图形 VO
 */
class ShapeVo extends BaseVo{
  constructor(id,x=0,y=0,w=100,h=100,shapeType){
    super(id);
    this.x = x ;
    this.y = y;
    this.w = w;
    this.h = h;
    this.shapeType = shapeType;
  }
}

/**
 * 方形 VO
 */
class RectShapeVo extends ShapeVo {
  constructor(id,x=0,y=0,w=100,h=100,rx, ry){
    super(id,x,y,w,h,ShapeType.Rect);
    this.rx = rx;
    this.ry = ry;
  }
}

/**
 * 菱形 VO
 */
class DiamondShapeVo extends ShapeVo {
  constructor(id,x=0,y=0,w=100,h=100){
    super(id,x,y,w,h,ShapeType.Diamond);
  }
}

/**
 * 三角形 VO
 */
class TriangleShapeVo extends ShapeVo {
  constructor(id,x=0,y=0,w=100,h=100){
    super(id,x,y,w,h,ShapeType.Triangle);
  }
}


/**
 * 椭圆 VO
 */
class EllipseShapeVo extends ShapeVo {
  constructor(id,x=0,y=0,w=100,h=100){
    super(id,x,y,w,h,ShapeType.Ellipse);
  }
}

/**
 * 线 VO
 */
class LineVo extends BaseVo {
  constructor(id,fromNode, toNode, lineType){
    super(id);
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.lineType = lineType; 
    this.tempToX = 0;
    this.tempToY = 0;
  }
}

export {
  BaseVo,
  ShapeVo,
  RectShapeVo,
  DiamondShapeVo,
  TriangleShapeVo,
  EllipseShapeVo,
  LineVo,
}