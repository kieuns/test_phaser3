/* eslint-disable no-unused-vars */

import Phaser from 'phaser'

////

class TickHandler
{
    #tickDur = 1000;
    #tickTimerId = undefined;
    #tickCount = 0;

    constructor()
    {
    }

    start()
    {
        this.tickCount = 0;
        this.tickTimerId = setInterval(this.onTick.bind(this), this.#tickDur);
        console.log(this.tickCount);
    }

    stop()
    {
        clearInterval(this.tickTimerId);
    }

    onTick()
    {
        this.tickCount += 1;
        console.log('onTick() : ', this.tickCount);
    }

    reserve()
    {
    }

    register()
    {
    }
}

////

class ObjectMover
{
    #sprite = undefined;
    #fromPos = undefined;
    #toPos = undefined;

    initWith(spriteObj)
    {
    }

    setMovParam(fromPos, toPos)
    {
    }

    start()
    {
    }

    onMove()
    {
    }
}

////

class SimpleLine
{
    #startPos = new Phaser.Math.Vector2(-100, -100);
    #endPos = new Phaser.Math.Vector2(-100, -100);

    setStartPosition(x, y)
    {
        this.#startPos.set(x,y);
        this.#endPos.set(x,y);
    }

    setEndPosition(x, y)
    {
        this.#endPos.set(x,y);
    }

    cancel() {
        this.#startPos.set(-100, -100);
        this.#endPos.set(-100, -100);
    }

    updateEndPosition(x, y)
    {
        this.#endPos.x = x;
        this.#endPos.y = y;
    }

    getStartPos() {
        return this.#startPos;
    }

    getEndPos() {
        return this.#endPos;
    }
}

////

class ClickedLine
{
    _simpleLine = new SimpleLine();
    _scene = null;
    _lineGeom = null;
    _lineStyle = { fillStyle:{color:0xffffff, size:1, alpha:1.0 } };

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
        // this._lineGeom.x1 = x;
        // this._lineGeom.y1 = y;
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

    onDraw(graphic, dt)
    {
        graphic.lineStyle(this._lineStyle.fillStyle.size, this._lineStyle.fillStyle.color, this._lineStyle.fillStyle.alpha);
        graphic.strokeLineShape(this._lineGeom);
    }
}

////

export class TickTest extends Phaser.Scene
{
    static instance = undefined;

    _tickHandler = null;
    _objMov1 = null;

    _clickLineArr = null;

    constructor()
    {
        super('TickTest');
        TickTest.instance = this;
        this._mouseDown = false;
        this._clickedLine = null;
        console.log(this.constructor.name, ': done');
    }

    preload()
    {
        this.load.image('missile', './assets/rocket.png');

        this._tickHandler = new TickHandler();
        this._objMov1 = new ObjectMover();
        this._clickLineArr = [];

        console.log(this.constructor.name, ': preload : done');
    }

    create()
    {
        this.input.mouse.disableContextMenu();

        this._objMov1.initWith(this.add.image(0, 0, 'missile'));

        this.input.on('pointerdown', this.onPointerDown.bind(this));
        this.input.on('pointerup', this.onPointerUp.bind(this));
        this.input.on('gameout', this.onPointerUp); // canvas out
        this.input.on('pointermove', this.onPointerMove.bind(this));

        this.graphics = this.add.graphics();
    }

    update(time, delta)
    {
        this.graphics.clear();
        if(this._clickedLine) {
            this._clickedLine.onDraw(this.graphics, delta);
        }
        this._clickLineArr.forEach((item, index, array) => item.onDraw(this.graphics, delta) );
    }

    cancelInputCapture()
    {
        this._mouseDown = false;
        this._clickedLine = null;
    }

    /** @param {Phaser.Input.Pointer} pointer */
    onPointerDown(pointer)
    {
        if(!pointer.active) return;
        let lbtn_down = pointer.leftButtonDown();
        let rbtn_down = pointer.rightButtonDown();

        if(!this._mouseDown && lbtn_down && !rbtn_down)
        {
            this._mouseDown = true;
            //console.log('onPointerDown', pointer);
            this._clickedLine = new ClickedLine(this, pointer.x, pointer.y);
        }
        else if(this._mouseDown && rbtn_down)
        {
            this.cancelInputCapture();
        }
    }

    /** @param {Phaser.Input.Pointer} pointer */
    onPointerMove(pointer)
    {
        if(!pointer.active) {
            if(this._clickedLine) {
                this.cancelInputCapture();
            }
            return;
        }
        if(this._mouseDown && pointer.leftButtonDown())
        {
            //console.log('onPointerMove', pointer);
            if(this._clickedLine) {
                this._clickedLine.updateEndPosition(pointer.x, pointer.y);
            }
        }
    }

    /** @param {Phaser.Input.Pointer} pointer */
    onPointerUp(pointer)
    {
        if(!pointer.active) {
            if(this._clickedLine || this._mouseDown) {
                this.cancelInputCapture();
            }
            return;
        }
        let lbtn_up = pointer.leftButtonReleased();

        if(this._mouseDown && lbtn_up)
        {
            this._mouseDown = false;
            //console.log('onPointerUp', pointer);
            if(this._clickedLine) {
                this._clickedLine.close();
                this._clickLineArr.push(this._clickedLine);
                this._clickedLine = null;
            }
        }
    }

}



