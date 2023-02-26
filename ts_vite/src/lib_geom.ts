/* eslint-disable no-unused-vars */

import { log } from "./log";


//=====================================================================================================================

export class SimpleLineInfo
{
    private startPos = new Phaser.Math.Vector2(-100, -100);
    private endPos = new Phaser.Math.Vector2(-100, -100);

    setStartPosition(x:number, y:number)
    {
        this.startPos.set(x,y);
        this.endPos.set(x,y);
    }

    setEndPosition(x?:number, y?:number)
    {
        if(x && y) {
            this.endPos.set(x,y);
        }
    }

    cancel() {
        this.startPos.set(-100, -100);
        this.endPos.set(-100, -100);
    }

    updateEndPosition(x:number, y:number)
    {
        this.endPos.x = x;
        this.endPos.y = y;
    }

    getStartPos() {
        return this.startPos;
    }

    getEndPos() {
        return this.endPos;
    }
}


//=====================================================================================================================

export class ClickedLine
{
    _simpleLine:SimpleLineInfo = new SimpleLineInfo();
    _scene:Phaser.Scene = null;
    _lineGeom:Phaser.Geom.Line = null;
    _lineStyle = { fillStyle:{color:0xffffff, size:1, alpha:1.0 } };

    get line() { return this._lineGeom; }

    constructor(scene:Phaser.Scene, x:number, y:number)
    {
        this._scene = scene;
        if(x && y) {
            this.firstClick(x,y);
        }
    }

    firstClick(x:number, y:number)
    {
        this._simpleLine.setStartPosition(x,y);
        this._lineGeom = new Phaser.Geom.Line(x, y, x, y);
    }

    updateEndPosition(x:number, y:number)
    {
        this._simpleLine.updateEndPosition(x, y);
        this._lineGeom.x2 = x;
        this._lineGeom.y2 = y;
    }

    close()
    {
        this._simpleLine.setEndPosition();
    }

    onDraw(graphic:Phaser.GameObjects.Graphics, dt:number)
    {
        graphic.lineStyle(this._lineStyle.fillStyle.size, this._lineStyle.fillStyle.color, this._lineStyle.fillStyle.alpha);
        graphic.strokeLineShape(this._lineGeom);
    }

    /** @returns {number} Math.atan() 리턴값 */
    rotationGet()
    {
        let dx = Math.ceil(this._lineGeom.x2 - this._lineGeom.x1);
        let dy = Math.ceil(this._lineGeom.y2 - this._lineGeom.y1);
        let slope = dy / dx;
        //let rad = Math.atan(slope);
        // -PI ~ PI (-180 ~ 180) 값을 구하는 aton2를 쓰니 좀 더 편하다.
        let rad = Math.atan2(dy, dx);
        if(log.detail)
        {
            console.log.apply(console, ['rot (x2,x1)',this._lineGeom.x2.toFixed(4), ',', this._lineGeom.x1.toFixed(4), '(y2,y1)',this._lineGeom.y2.toFixed(4), ',', this._lineGeom.y1.toFixed(4)]);
            console.log.apply(console, ['rot (x2-x1)', dx, ' (y2-y1)', dy]);
            console.log('Math.atan(): ', rad.toFixed(4), ':', Phaser.Math.RadToDeg(rad).toFixed(4));
        }
        return rad;
    }
}

//=====================================================================================================================

/**
 * @param {Phaser.GameObjects.Graphics} [graphics]
 * @param {Phaser.Geom.Line} [lineGeom]
 * @param {number} [x1]
 * @param {number} [y1]
 * @param {number} [x2]
 * @param {number} [y2]
 * @param {number} [lineSize]
 * @param {number} [lineColor]
 * @param {number} [lineAlpha]
 */
export function drawLine(graphics:Phaser.GameObjects.Graphics, lineGeom:Phaser.Geom.Line, x1:number, y1:number, x2:number, y2:number, lineSize:number, lineColor:number, lineAlpha:number)
{
    // // sample : this._lineStyle = { fillStyle:{color:0x999999, size:1, alpha:1.0 } };
    // const line_size = lineSize ? lineSize : 1;
    // const line_color = lineColor ? lineColor : 0x999999;
    // const line_alpha = lineAlpha ? lineAlpha : 1.0;
    // //graphics.clear();
    // graphics.lineStyle(this._lineStyle.fillStyle.size, this._lineStyle.fillStyle.color, this._lineStyle.fillStyle.alpha);
    // lineGeom.x1 = x1;
    // lineGeom.y1 = y1;
    // lineGeom.x2 = x2;
    // lineGeom.y2 = y2;
    // graphics.strokeLineShape(lineGeom);
}