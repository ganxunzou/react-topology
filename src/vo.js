/**
 * 基类VO
 */
class BaseVo {
  constructor(id){
    this.id = id;
  }
}

/**
 * 图形 VO
 */
class ShapeVo extends BaseVo{
  constructor(id,x,y,w,h){
    super(id);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

/**
 * 方形 VO
 */
class RectShapVo extends ShapeVo{
  constructor(id,x,y,w,h,rx, ry){
    super(id);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rx = rx;
    this.ry = ry;
  }
}

/**
 * 线 VO
 */
class Line extends BaseVo{
  constructor(id,fromNode, toNode, lineType){
    super(id);
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.lineType = lineType; 
  }
}

export {
  BaseVo,
  ShapeVo,
  RectShapVo,
  Line,
}