/* eslint-disable no-unused-vars */

import { log } from "./log";
import { ObjectMover } from "./ObjectMover";
import { TickPlay } from "./TickPlay";


//=====================================================================================================================

class SimpleLineInfo
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

//=====================================================================================================================

class ClickedLine
{
    _simpleLine:SimpleLineInfo = new SimpleLineInfo();
    _scene:Phaser.Scene = null;
    _lineGeom:Phaser.Geom.Line = null;
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

    /** @returns {number} Math.atan() ????????? */
    rotationGet()
    {
        let dx = Math.ceil(this._lineGeom.x2 - this._lineGeom.x1);
        let dy = Math.ceil(this._lineGeom.y2 - this._lineGeom.y1);
        let slope = dy / dx;
        //let rad = Math.atan(slope);
        // -PI ~ PI (-180 ~ 180) ?????? ????????? aton2??? ?????? ??? ??? ?????????.
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

export class TickTestScene extends Phaser.Scene
{
    static instance = undefined;

    /** @type {TickPlay} */
    _tickPlay:TickPlay = null;

    /** @type {ObjectMover} */
    _objMov1:ObjectMover = null;

    /** @type {ObjectMover} */
    _objMov2:ObjectMover = null;

    /** @type {array} */
    _clickLineArr:ClickedLine[] = null;

    /** @type {ClickedLine} */
    _clickedLine:ClickedLine = null;

    /** @type {boolean} */
    _shiftKeyPressed:boolean = false;

    private _mouseDown = false;
    protected graphics:Phaser.GameObjects.Graphics = null;


    constructor()
    {
        super('TickTest');
        TickTestScene.instance = this;
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
        this._objMov2.rotationCorrectionSet(Math.PI/2); // 90'

        //this._spr1 = this.add.image(150, 150, 'missile');

        // // @ts-ignore
        // this._tickPlay.reserveBy(0.1, () => {
        //     this._objMov2.getSprite().angle = this._objMov2.getSprite().angle + 5;
        // }, 10);

        this.input.on('pointerdown', this.onPointerDown.bind(this));
        this.input.on('pointerup', this.onPointerUp.bind(this));
        this.input.on('gameout', this.onCanvasOut.bind(this)); // canvas out
        this.input.on('pointermove', this.onPointerMove.bind(this));

        this.input.keyboard.on('keydown', (event) => {
            if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.SHIFT) {
                this._shiftKeyPressed = true;
                console.log('shift down');
            }
        });
        // ???????????? ???????????? ???????
        this.input.keyboard.on('keyup', (event) => {
            if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.SHIFT) {
                this._shiftKeyPressed = false;
                console.log('shift up');
            }
        });

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

        this._objMov1.rotationAdd(2 * ((delta/1000)));
        this._objMov2.onMove(delta);
    }

    /** @param {Phaser.Input.Pointer} pointer */
    onPointerDown(pointer)
    {
        // if(!pointer.active) return;

        let lbtn_down = pointer.leftButtonDown();
        let rbtn_down = pointer.rightButtonDown();

        if(!this._mouseDown && lbtn_down && !rbtn_down) {
            this.startMouseInputCapture(pointer.x, pointer.y);
        }
        else if(this._mouseDown && rbtn_down) {
            this.cancelMouseInputCapture();
        }
    }

    /** @param {Phaser.Input.Pointer} pointer */
    onPointerMove(pointer)
    {
        if(this._mouseDown && pointer.leftButtonDown()) {
            this.updateMouseInputCapture(pointer.x, pointer.y);
        }
    }

    /** @param {Phaser.Input.Pointer} pointer */
    onPointerUp(pointer)
    {
        let lbtn_up = pointer.leftButtonReleased();

        if(this._mouseDown && lbtn_up) {
            this.closeMouseInputCapture(pointer.x, pointer.y);
        }
    }

    /** ???????????? ???????????? ???????????? ??????
     * @param {Phaser.Input.Pointer} pointer */
    onCanvasOut(pointer)
    {
        if(this._clickedLine || this._mouseDown) {
            this.cancelMouseInputCapture();
        }
    }

    startMouseInputCapture(x, y)
    {
        this._mouseDown = true;
        this._clickedLine = new ClickedLine(this, x, y);
    }

    cancelMouseInputCapture()
    {
        this._mouseDown = false;
        this._clickedLine = null;
    }

    updateMouseInputCapture(pt_x, pt_y)
    {
        if(!this._clickedLine) { return; }
        let x = pt_x;
        let y = pt_y;
        if(this._shiftKeyPressed)
        {
            // ????????? ??? ????????? ???????????? ????????? ?????????
            let offset_x = pt_x - this._clickedLine.line.x1;
            let offset_y = pt_y - this._clickedLine.line.y1;
            // ????????? ???????????? 10 ?????? ?????? ??????.
            x = pt_x - (offset_x % 20);
            y = pt_y - (offset_y % 20);
        }
        this._clickedLine.updateEndPosition(x, y);
    }

    closeMouseInputCapture(ptx, pty)
    {
        this._mouseDown = false;

        if(!this._clickedLine) { return; }

        this._clickedLine.close();

        this._clickLineArr.push(this._clickedLine);
        let tm_line = this._clickedLine;
        this._clickedLine = null;

        this._objMov2.rotationSet(tm_line.rotationGet());
        this._objMov2.moveParamSet2(tm_line.line.getPointA(), tm_line.line.getPointB(), 5, true, () => { console.log('landed'); });

        this._tickPlay.reserveBy(2, (() => {
            if(log.detail) { console.log('ReserveWork : tick: ', this._tickPlay.getNowTick(), ', ', this._tickPlay.getNowAsTime()); }

            let idx = this._clickLineArr.findIndex((v, i, a) => v === tm_line);
            if(idx !== -1) {
                this._clickLineArr.splice(idx, 1);
                if(log.detail) { console.log('_clickLineArr : count : ', this._clickLineArr.length); }
            }
        }).bind(this));
    }

}



