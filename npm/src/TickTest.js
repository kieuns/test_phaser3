/* eslint-disable no-unused-vars */

import Phaser, { Time } from 'phaser'

////

class TickPlay
{
    /** @type {number} */
    _tickNowIndex = 0;

    /** @type {number} */
    _tickMaxPerSec = 10;

    /** @type {number} 게임이 끝나는 틱 */
    _tickCleared = -1;

    /** @type {number} 게임이 끝나는 시간 */
    _expectEndTime = 0;

    _tickTimerId = null;

    _loopStarted = false;

    /** _workTodo:{time:number, func:()=>{}} [] = null;
     * @type {array} */
    _workTodo = null;

    constructor()
    {
    }

    getNowTick() { return this._tickNowIndex; }
    getNowAsTime() { return this._tickNowIndex * this._tickMaxPerSec; }

    /** @param {number} expectEndTime sec */
    start(expectEndTime)
    {
        this._expectEndTime = this._tickMaxPerSec * (expectEndTime ? expectEndTime : (12*60));
        this._tickNowIndex = 0;
        this._workTodo = [];
        this._tickTimerId = setInterval( this.onTick.bind(this), 1000 / this._tickMaxPerSec );
        this._loopStarted = true;
        console.log('TickPlay : start');
    }

    stop()
    {
        clearInterval(this._tickTimerId);
    }

    onTick()
    {
        this._tickNowIndex += 1;
        //console.log('TickPlay : onTick() : ', this._tickNowIndex, ', work count: ', this._workTodo.length);

        for(let i = 0; i < this._workTodo.length; i++) {
            let item = this._workTodo[i];
            if(item.tick > this._tickNowIndex) { break; }
            if(item.tick <= this._tickNowIndex) {
                item.delete = true;
                item.func();
            }
        }

        let tmp_ar = [];
        for(let i = 0; i < this._workTodo.length; i++) {
            let item = this._workTodo[i];
            if(item.delete === false) {
                tmp_ar.push(item);
            }
        }
        this._workTodo = tmp_ar;
    }

    /**
     * @param {number} time - 예약 시간, 정확한 시간 명시 ms
     * @param {function} callback - 호출 함수
     */
    reserveTo(time, callback)
    {
        if(!this._loopStarted) { console.log('TickPlay : not started'); }
        let nx_tick = Math.floor(time*this._tickMaxPerSec);
        this._workTodo.push({ tick:nx_tick, func:callback, delete:false });
    }

    /**
     * @param {number} time - 예약 시간, 지금에서 얼마 뒤. ms
     * @param {function} callback - 호출 함수
     */
    reserveBy(time, callback)
    {
        if(!this._loopStarted) { console.log('TickPlay : not started'); }
        let nx_tick = this._tickNowIndex+Math.floor(time*this._tickMaxPerSec);
        console.log('tickplay : now: ', this._tickNowIndex, ' expect at : ', nx_tick);
        this._workTodo.push({tick: nx_tick, func:callback, delete:false});
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

    /** @type {TickPlay} */
    _tickPlay = null;

    /** @type {ObjectMover} */
    _objMov1 = null;

    /** @type {array} */
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

        this._tickPlay = new TickPlay();
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
        // @ts-ignore
        this._tickPlay.start();
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
                let tm_line = this._clickedLine;
                this._clickedLine = null;

                this._tickPlay.reserveBy(0.1, (() => {
                    console.log('ReserveWork : tick: ', this._tickPlay.getNowTick(), ', ', this._tickPlay.getNowAsTime());
                    let idx = this._clickLineArr.findIndex((v, i, a) => v === tm_line);
                    if(idx !== -1) {
                        this._clickLineArr.splice(idx, 1);
                        console.log('_clickLineArr : count : ', this._clickLineArr.length);
                    }
                }).bind(this));
            }
        }
    }

}



