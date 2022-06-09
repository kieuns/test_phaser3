/* eslint-disable no-unused-vars */

import Phaser from 'phaser'
import { log } from './log';


//=====================================================================================================================

export class SimpleLineInfo
{
    _startPos = new Phaser.Math.Vector2(-100, -100);
    _endPos = new Phaser.Math.Vector2(-100, -100);

    setStartPosition(x, y)
    {
        this._startPos.set(x,y);
        this._endPos.set(x,y);
    }

    setEndPosition(x, y)
    {
        this._endPos.set(x,y);
    }

    cancel() {
        this._startPos.set(-100, -100);
        this._endPos.set(-100, -100);
    }

    updateEndPosition(x, y)
    {
        this._endPos.x = x;
        this._endPos.y = y;
    }

    getStartPos() {
        return this._startPos;
    }

    getEndPos() {
        return this._endPos;
    }
}

//=====================================================================================================================

export class ClickedLine
{
    /** @type {SimpleLineInfo} */
    _simpleLine = new SimpleLineInfo();

    /** @type {Phaser.Scene} */
    _scene = null;

    /** @type {Phaser.Geom.Line} */
    _lineGeom = null;

    _lineStyle = { fillStyle:{color:0xffffff, size:1, alpha:1.0 } };

    get line() { return this._lineGeom; }

    constructor(scene, x, y)
    {
        this._scene = scene;
        if(x && y) {
            this.firstClick(x,y);
        }
    }

    firstClick(x, y)
    {
        this._simpleLine.setStartPosition(x,y);
        this._lineGeom = new Phaser.Geom.Line(x, y, x, y);
    }

    updateEndPosition(x, y)
    {
        this._simpleLine.updateEndPosition(x, y);
        this._lineGeom.x2 = x;
        this._lineGeom.y2 = y;
    }

    close()
    {
        this._simpleLine.setEndPosition();
    }

    /**
     * @param {Phaser.GameObjects.Graphics} graphic
     * @param {number} dt
     */
    onDraw(graphic, dt)
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
export function drawLine(graphics, lineGeom, x1, y1, x2, y2, lineSize, lineColor, lineAlpha)
{
    // sample : this._lineStyle = { fillStyle:{color:0x999999, size:1, alpha:1.0 } };
    const line_size = lineSize ? lineSize : 1;
    const line_color = lineColor ? lineColor : 0x999999;
    const line_alpha = lineAlpha ? lineAlpha : 1.0;
    //graphics.clear();
    graphics.lineStyle(this._lineStyle.fillStyle.size, this._lineStyle.fillStyle.color, this._lineStyle.fillStyle.alpha);
    lineGeom.x1 = x1;
    lineGeom.y1 = y1;
    lineGeom.x2 = x2;
    lineGeom.y2 = y2;
    graphics.strokeLineShape(lineGeom);
}