import {LineType} from '../constant';
// 后续优化
const padding = 8;
const border = 8;

export default class CoordinateCalcUtils{
  static calcPointsByLineVo(lineVo){
    if(lineVo.lineType == LineType.Straight){
      // 直线
      return CoordinateCalcUtils.calcStraightLinePoints(lineVo);
    }
  }

  static calcStraightLinePoints(lineVo){
    let bInfo = CoordinateCalcUtils.baseInfo(lineVo);

    // 直线总共有八种情况
    if(bInfo.tNodeX > (bInfo.fNodeX + bInfo.fNodeW) && bInfo.tNodeY < (bInfo.fNodeY + bInfo.fNodeH) && bInfo.tNodeY > bInfo.fNodeY) {
      let fX = bInfo.fNodeX + bInfo.fNodeW;
      let fY = bInfo.fNodeY + bInfo.fNodeH / 2;
      let tX = bInfo.tNodeX;
      let tY = bInfo.tNodeY + bInfo.tNodeH /2;
      return [fX, fY, tX, tY];
    } else if(bInfo.tNodeX > (bInfo.fNodeX + bInfo.fNodeW) && bInfo.tNodeY < bInfo.fNodeY){
     
      let fX = bInfo.fNodeX + bInfo.fNodeW;
      let fY = bInfo.fNodeY + bInfo.fNodeH / 2;
      let tX = bInfo.tNodeX + bInfo.tNodeW /2;
      let tY = bInfo.tNodeY + bInfo.tNodeH;
      
      return [fX, fY, tX, tY];
    } else if(bInfo.tNodeX < (bInfo.fNodeX + bInfo.fNodeW) && bInfo.tNodeX > bInfo.fNodeX && bInfo.tNodeY < bInfo.fNodeY) {
      let fX = bInfo.fNodeX + bInfo.fNodeW / 2;
      let fY = bInfo.fNodeY;
      let tX = bInfo.tNodeX + bInfo.tNodeW /2;
      let tY = bInfo.tNodeY + bInfo.tNodeH;
      return [fX, fY, tX, tY];
    } else if(bInfo.tNodeX < bInfo.fNodeX && (bInfo.tNodeY + bInfo.tNodeH) < bInfo.fNodeY) {
      let fX = bInfo.fNodeX + bInfo.fNodeW / 2;
      let fY = bInfo.fNodeY;
      let tX = bInfo.tNodeX + bInfo.tNodeW;
      let tY = bInfo.tNodeY + bInfo.tNodeH / 2;
      return [fX, fY, tX, tY];
    } else if((bInfo.tNodeX+ bInfo.tNodeW) < bInfo.fNodeX && bInfo.tNodeY < (bInfo.fNodeY + bInfo.fNodeH)){
      let fX = bInfo.fNodeX;
      let fY = bInfo.fNodeY + bInfo.fNodeH / 2;
      let tX = bInfo.tNodeX + bInfo.tNodeW;
      let tY = bInfo.tNodeY + bInfo.tNodeH / 2;
      return [fX, fY, tX, tY];
    } else if((bInfo.tNodeX+ bInfo.tNodeW) < bInfo.fNodeX && bInfo.tNodeY > (bInfo.fNodeY + bInfo.fNodeH)){
      let fX = bInfo.fNodeX;
      let fY = bInfo.fNodeY + bInfo.fNodeH / 2;
      let tX = bInfo.tNodeX + bInfo.tNodeW /2;
      let tY = bInfo.tNodeY;
      return [fX, fY, tX, tY];
    } else if((bInfo.tNodeX+ bInfo.tNodeW) > bInfo.fNodeX && bInfo.tNodeX < (bInfo.fNodeX + bInfo.fNodeW) && bInfo.tNodeY > (bInfo.fNodeY + bInfo.fNodeH)) {
      let fX = bInfo.fNodeX + bInfo.fNodeW / 2;
      let fY = bInfo.fNodeY + bInfo.fNodeH;
      let tX = bInfo.tNodeX + bInfo.tNodeW /2;
      let tY = bInfo.tNodeY;
      return [fX, fY, tX, tY];
    } else if(bInfo.tNodeX > (bInfo.fNodeX + bInfo.fNodeW) && bInfo.tNodeY > (bInfo.fNodeY + bInfo.fNodeH)) {
      let fX = bInfo.fNodeX + bInfo.fNodeW / 2;
      let fY = bInfo.fNodeY + bInfo.fNodeH;
      let tX = bInfo.tNodeX ;
      let tY = bInfo.tNodeY + bInfo.tNodeH /2;
      return [fX, fY, tX, tY];
    }
  }

  static baseInfo(lineVo){
    let pb = padding + border;
    let fNodeX = lineVo.fromNode.x + pb;
    let fNodeY = lineVo.fromNode.y + pb;
    let fNodeW = lineVo.fromNode.w - pb*2;
    let fNodeH = lineVo.fromNode.h - pb*2;
    let tNodeX = lineVo.toNode ? (lineVo.toNode.x + pb) : lineVo.tempToX;
    let tNodeY = lineVo.toNode ? (lineVo.toNode.y + pb) : lineVo.tempToY;
    let tNodeW = lineVo.toNode ? (lineVo.toNode.w - pb*2) : 0;
    let tNodeH = lineVo.toNode ? (lineVo.toNode.h - pb*2) : 0; 
    return {fNodeX, fNodeY, fNodeW, fNodeH, tNodeX, tNodeY, tNodeW, tNodeH};
  }
}