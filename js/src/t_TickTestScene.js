/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */

import Phaser from 'phaser'

import { ClickedLine } from './lib_geom';
import { log } from './log';
import { SpriteMover } from './SpriteMover';
import { TickPlay } from './TickPlay';

//=====================================================================================================================


export class TickTestScene extends Phaser.Scene
{
    static instance = undefined;

    /** @type {TickPlay} */
    _tickPlay = null;

    /** @type {SpriteMover} */
    _objMov1 = null;

    /** @type {SpriteMover} */
    _objMov2 = null;

    /** @type {ClickedLine[]} */
    _clickLineArr = null;

    /** @type {ClickedLine} */
    _clickedLine = null;

    /** @type {boolean} */
    _shiftKeyPressed = false;

    _mouseDown = false;
    /** type {Phaser.GameObjects.Graphics} */
    graphics = null;

    ////

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

        this._objMov1 = new SpriteMover();
        this._objMov1.initWith(this.add.image(100, 100, 'missile'));

        this._objMov2 = new SpriteMover();
        this._objMov2.initWith(this.add.image(150, 150, 'missile'));
        // @ts-ignore
        this._objMov2.rotationCorrectionSet(Math.PI/2); // 90'

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

    ////

    /**
     * @param {number} time - unit ms
     * @param {number} delta - unit ms
     */
    // @ts-ignore
    update(time, delta)
    {
        this.graphics.clear();
        if(this._clickedLine) {
            this._clickedLine.onDraw(this.graphics, delta);
        }
        // @ts-ignore
        // @ts-ignore
        this._clickLineArr.forEach((item, index, array) => item.onDraw(this.graphics, delta) );

        // @ts-ignore
        this._objMov1.rotationAdd(2 * ((delta/1000)));
        this._objMov2.onUpdate(delta);
    }

    ////

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
    // @ts-ignore
    onCanvasOut(pointer)
    {
        if(this._clickedLine || this._mouseDown) {
            this.cancelMouseInputCapture();
        }
    }

    ////

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

    // @ts-ignore
    closeMouseInputCapture(ptx, pty)
    {
        this._mouseDown = false;

        if(!this._clickedLine) { return; }

        this._clickedLine.close();

        this._clickLineArr.push(this._clickedLine);
        let tm_line = this._clickedLine;
        this._clickedLine = null;

        // @ts-ignore
        this._objMov2.rotationSet(tm_line.rotationGet());
        this._objMov2.moveParamSet2(tm_line.line.getPointA(), tm_line.line.getPointB(), 5, true, () => { console.log('landed'); });

        // @ts-ignore
        this._tickPlay.reserveOnTime(2, (() => {
            if(log.detail) { console.log('ReserveWork : tick: ', this._tickPlay.getNowTick(), ', ', this._tickPlay.getNowAsTime()); }

            // @ts-ignore
            let idx = this._clickLineArr.findIndex((v, i, a) => v === tm_line);
            if(idx !== -1) {
                this._clickLineArr.splice(idx, 1);
                if(log.detail) { console.log('_clickLineArr : count : ', this._clickLineArr.length); }
            }
        }).bind(this));
    }
}



