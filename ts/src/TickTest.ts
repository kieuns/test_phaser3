/* eslint-disable no-unused-vars */

// @ts-ignore
import Phaser, { Time } from 'phaser'

////

interface ITickWork
{
    tick:number;
    func:()=>void;
    delete:boolean;
}

class TickPlay
{
    protected _tickNowIndex:number = 0;

    protected _tickMaxPerSec:number = 10;

    /** 게임이 끝나는 틱 */
    protected _tickCleared:number = -1;

    /** 게임이 끝나는 시간 */
    protected _expectEndTime:number = 0;

    protected _tickTimerId:number = -1;

    protected _loopStarted:boolean = false;

    /** 작업 목록 */
    protected _workTodo:ITickWork[] = [];


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

        let tmp_ar:ITickWork[] = [];
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
        if(!this._loopStarted) { console.warn('TickPlay : not started'); return; }
        let nx_tick = Math.floor(time*this._tickMaxPerSec);
        this._workTodo.push({ tick:nx_tick, func:callback, delete:false });
    }

    /**
     * @param {number} time - 예약 시간, 지금에서 얼마 뒤. ms
     * @param {function} callback - 호출 함수
     * @param {number} repeatCnt
     */
    reserveBy(time, callback, repeatCnt)
    {
        if(!this._loopStarted) { console.warn('TickPlay : not started'); return; }

        let loop_cnt = repeatCnt ? repeatCnt : 1;
        let repeat_time = time;

        for(let i = 0; i < loop_cnt; i++)
        {
            let nx_tick = this._tickNowIndex+Math.ceil(time*this._tickMaxPerSec);

            console.log('tickplay : now: ', this._tickNowIndex, ' expect at : ', nx_tick, ', time:', time.toFixed(4));

            this._workTodo.push({tick: nx_tick, func:callback, delete:false});

            time += repeat_time;
        }
    }
}

////

class ObjectMover
{
    private sprite:Phaser.GameObjects.Image = null;

    private fromPos:Phaser.Math.Vector2 = null;

    private toPos:Phaser.Math.Vector2 = null;

    /** 기본 회전 상태 */
    private rotated:number = 0;

    getSprite():Phaser.GameObjects.Image { return this.sprite; }

    initWith(spriteObj:Phaser.GameObjects.Image)
    {
        this.sprite = spriteObj;
    }

    /**
     * @param {Phaser.Math.Vector2} fromPos
     * @param {Phaser.Math.Vector2} toPos
     */
    setMovParam(fromPos, toPos)
    {
        this.fromPos = fromPos;
        this.toPos = toPos;
    }

    /** @param {number} rad - 기본회전상태. 0도는 오른쪽(1,0) 방향인데 이미지의 회전상태값을 저장해둔다. */
    setRotationOffset(rad : number)
    {
        this.rotated = rad;
        this.sprite.rotation = rad;
    }

    /** @param {number} rad - 라디언각도값 */
    setRotation(rad)
    {
        this.sprite.rotation = (rad-this.rotated);
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
    private startPos = new Phaser.Math.Vector2(-100, -100);
    private endPos = new Phaser.Math.Vector2(-100, -100);

    setStartPosition(x, y)
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

    updateEndPosition(x, y)
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

    // @ts-ignore
    onDraw(graphic, dt)
    {
        graphic.lineStyle(this._lineStyle.fillStyle.size, this._lineStyle.fillStyle.color, this._lineStyle.fillStyle.alpha);
        graphic.strokeLineShape(this._lineGeom);
    }

    /** @returns {number}  */
    getRotation()
    {
        let slope = (this._lineGeom.x2 - this._lineGeom.x1) / (this._lineGeom.y2 - this._lineGeom.y1)
        return Math.atan(slope);
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

    /** @type {ObjectMover} */
    _objMov2 = null;

    /** @type {array} */
    _clickLineArr = null;

    /** @type {ClickedLine} */
    _clickedLine = null;

    private _mouseDown = false;

    protected graphics:Phaser.GameObjects.Graphics = null;

    //_spr1:Phaser.GameObjects.Image = null;

    constructor()
    {
        super('TickTest');
        TickTest.instance = this;
        console.log(this.constructor.name, ': done');
    }

    preload()
    {
        this.load.image('missile', './assets/rocket.png');
        this._tickPlay = new TickPlay();
        this._clickLineArr = [];
        console.log(this.constructor.name, ': preload : done');
    }

    create()
    {
        this.input.mouse.disableContextMenu();

        // @ts-ignore
        this._tickPlay.start();

        this._objMov1 = new ObjectMover();
        this._objMov1.initWith(this.add.image(100, 100, 'missile'));

        this._objMov2 = new ObjectMover();
        this._objMov2.initWith(this.add.image(150, 150, 'missile'));
        this._objMov2.setRotationOffset(Math.PI/2); // 90'

        //this._spr1 = this.add.image(150, 150, 'missile');

        // // @ts-ignore
        // this._tickPlay.reserveBy(0.1, () => {
        //     this._objMov2.getSprite().angle = this._objMov2.getSprite().angle + 5;
        // }, 10);

        this.input.on('pointerdown', this.onPointerDown.bind(this));
        this.input.on('pointerup', this.onPointerUp.bind(this));
        this.input.on('gameout', this.onPointerUp); // canvas out
        this.input.on('pointermove', this.onPointerMove.bind(this));

        this.graphics = this.add.graphics();
    }

    // @ts-ignore
    update(time, delta)
    {
        this.graphics.clear();
        if(this._clickedLine) {
            this._clickedLine.onDraw(this.graphics, delta);
        }
        // @ts-ignore
        this._clickLineArr.forEach((item, index, array) => item.onDraw(this.graphics, delta) );
    }

    cancelInputCapture()
    {
        this._mouseDown = false;
        this._clickedLine = null;
    }

    onPointerDown(pointer:Phaser.Input.Pointer)
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

    onPointerMove(pointer:Phaser.Input.Pointer)
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

    onPointerUp(pointer:Phaser.Input.Pointer)
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

                let rot = tm_line.getRotation();
                this._objMov2.setRotation(rot);

                this._tickPlay.reserveBy(5, (() => {
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



