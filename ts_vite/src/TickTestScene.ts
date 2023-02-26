/* zeslint-disable no-unused-vars */

import { ClickedLine } from "./lib_geom";
import { log } from "./log";
import { ObjectMover } from "./ObjectMover";
import { TickPlay } from "./TickPlay";


//=====================================================================================================================

export class TickTestScene extends Phaser.Scene
{
    static instance:TickTestScene = undefined;

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
        this.load.image('missile', '/assets/rocket.png');
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

        this.input.keyboard.on('keydown', (event:any) => {
            if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.SHIFT) {
                this._shiftKeyPressed = true;
                console.log('shift down');
            }
        });
        // 크롬에서 안되는데 왜지?
        this.input.keyboard.on('keyup', (event:any) => {
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
    onPointerDown(pointer:Phaser.Input.Pointer)
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
    onPointerMove(pointer:Phaser.Input.Pointer)
    {
        if(this._mouseDown && pointer.leftButtonDown()) {
            this.updateMouseInputCapture(pointer.x, pointer.y);
        }
    }

    /** @param {Phaser.Input.Pointer} pointer */
    onPointerUp(pointer:Phaser.Input.Pointer)
    {
        let lbtn_up = pointer.leftButtonReleased();

        if(this._mouseDown && lbtn_up) {
            this.closeMouseInputCapture(pointer.x, pointer.y);
        }
    }

    /** 마우스가 캔바스를 벗어나면 호출
     * @param {Phaser.Input.Pointer} pointer */
    onCanvasOut(pointer:Phaser.Input.Pointer)
    {
        if(this._clickedLine || this._mouseDown) {
            this.cancelMouseInputCapture();
        }
    }

    startMouseInputCapture(x:number, y:number)
    {
        this._mouseDown = true;
        this._clickedLine = new ClickedLine(this, x, y);
    }

    cancelMouseInputCapture()
    {
        this._mouseDown = false;
        this._clickedLine = null;
    }

    updateMouseInputCapture(pt_x:number, pt_y:number)
    {
        if(!this._clickedLine) { return; }
        let x = pt_x;
        let y = pt_y;
        if(this._shiftKeyPressed)
        {
            // 첫번째 점 위치를 기준으로 변화값 구해서
            let offset_x = pt_x - this._clickedLine.line.x1;
            let offset_y = pt_y - this._clickedLine.line.y1;
            // 새로운 좌표에서 10 이하 값을 뺀다.
            x = pt_x - (offset_x % 20);
            y = pt_y - (offset_y % 20);
        }
        this._clickedLine.updateEndPosition(x, y);
    }

    closeMouseInputCapture(ptx:number, pty:number)
    {
        this._mouseDown = false;

        if(!this._clickedLine) { return; }

        this._clickedLine.close();

        this._clickLineArr.push(this._clickedLine);
        let tm_line = this._clickedLine;
        this._clickedLine = null;

        this._objMov2.rotationSet(tm_line.rotationGet());
        this._objMov2.moveParamSet2(tm_line.line.getPointA(), tm_line.line.getPointB(), 5, true, () => { console.log('landed'); });

        this._tickPlay.reserveOnTime(2, (() => {
            if(log.detail) { console.log('ReserveWork : tick: ', this._tickPlay.getNowTick(), ', ', this._tickPlay.getNowAsTime()); }

            let idx = this._clickLineArr.findIndex((v, i, a) => v === tm_line);
            if(idx !== -1) {
                this._clickLineArr.splice(idx, 1);
                if(log.detail) { console.log('_clickLineArr : count : ', this._clickLineArr.length); }
            }
        }).bind(this));
    }

}



