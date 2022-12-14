// @ts-nocheck
/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */

import dat from 'dat.gui';
import Phaser from 'phaser'
import { ClickedLine } from './lib_geom';
import { log } from './log';
import { SpriteMover } from './SpriteMover';
import { TickPlay } from './TickPlay';

//=====================================================================================================================

class dgui
{
    /** @type {dgui} */
    static instance = null;
    static init() {
        dgui.instance = new dgui();
        dgui.instance.install();
    }

    /** @type {dat.GUI} */
    _datGui = null;

    /** dat.GUI 를 특정 돔에 설치한다. */
    install()
    {
        this._datGui = new dat.GUI();
        const target_dom = document.getElementById('datgui');
        if (target_dom)
        {
            this._datGui.domElement.style.setProperty('position', 'absolute');
            this._datGui.domElement.style.setProperty('top', '0px');
            this._datGui.domElement.style.setProperty('left', '0px');
            target_dom?.appendChild(this._datGui.domElement);
        }
        this.buidMenu();
    }

    // .listen() : 값의 변화를 계속 감시
    // .onChange( (v) => {} ) : 값이 변할때 호출

    /** 메뉴 빌드 */
    buidMenu()
    {
        let root_folder = this._datGui;
        {
            root_folder.add(ObjectMoveScene.instance, 'MovType_AverageVelocity').name('정속')
                .listen()
                .onChange((v) => { this.update_MovType(1); });
            root_folder.add(ObjectMoveScene.instance, 'MovType_AccelVelocity1').name('가속')
                .listen()
                .onChange((v) => { this.update_MovType(2); });
        }
        //let opt1_folder = this._datGui.addFolder('[옵션1]');
    }

    /** @param {number} [type] */
    update_MovType(type)
    {
        let inst = ObjectMoveScene.instance;
        console.log('update_MovType: ', type);
        switch(type)
        {
        case 1:
            inst.MovType_AverageVelocity = true;
            inst.MovType_AccelVelocity1 = false;
            break;
        case 2:
            inst.MovType_AverageVelocity = false;
            inst.MovType_AccelVelocity1 = true;
            break;
        }
    }
}

//=====================================================================================================================

export class ObjectMoveScene extends Phaser.Scene
{
    static instance = undefined;

    /** @type {TickPlay} */
    _tickPlay = null;

    /** @type {SpriteMover} */
    _movingObj1 = null;

    /** @type {SpriteMover} */
    _movingObj2 = null;

    /** @type {ClickedLine[]} */
    _clickLineArr = null;

    /** @type {ClickedLine} */
    _clickedLine = null;

    /** @type {boolean} */
    _shiftKeyPressed = false;

    _mouseDown = false;
    /** type {Phaser.GameObjects.Graphics} */
    graphics = null;

    /** type {Phaser.GameObjects.Text[]} */
    _textArr = [];

    ////

    /** @type {boolean} 정속 움직임 */
    MovType_AverageVelocity = true;
    /** @type {boolean} 가속 움직임 */
    MovType_AccelVelocity1 = false;

    ////

    constructor()
    {
        super('ObjectMove');
        ObjectMoveScene.instance = this;
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

        this._movingObj1 = new SpriteMover();
        this._movingObj1.initWith(this.add.image(100, 100, 'missile'));
        this._movingObj1.rotationCorrectionSet(Math.PI/2); // 90'
        this._movingObj1.spriteGet().setOrigin(0.5, 1);

        this._movingObj2 = new SpriteMover();
        this._movingObj2.initWith(this.add.image(150, 150, 'missile'));
        this._movingObj2.rotationCorrectionSet(Math.PI/2); // 90'

        // this._tickPlay.reserveBy(0.1, () => { this._objMov2.getSprite().angle = this._objMov2.getSprite().angle + 5; }, 10);

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
        // 크롬에서 안되는데 왜지?
        this.input.keyboard.on('keyup', (event) => {
            if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.SHIFT) {
                this._shiftKeyPressed = false;
                console.log('shift up');
            }
        });

        let text_y_begin = 20;
        let text_y_step = 20;
        for( let i = 0; i < 5; i++) {
            let text1 = this.add.text(0, text_y_begin + (text_y_step * i), ">", { font: "15px Consolas" });
            this._textArr.push(text1);
        }

        this.graphics = this.add.graphics();

        // Dat.GUI 설치
        dgui.init();
    }

    ////

    /**
     * @param {number} time - unit ms
     * @param {number} delta - unit ms
     */
    update(time, delta)
    {
        let str1 = '> update: time:' + time.toFixed(2) + ' delta(ms):' + delta.toFixed(2) + ' delta(sec):' + (delta/1000).toFixed(4);
        this._textArr[0].text = str1;

        this.graphics.clear();
        if(this._clickedLine) {
            this._clickedLine.onDraw(this.graphics, delta);
        }
        // @ts-ignore
        this._clickLineArr.forEach((item, index, array) => item.onDraw(this.graphics, delta) );

        this._movingObj1.rotationMinus((2*Math.PI) * (delta/(1000*60)));
        this._movingObj2.onUpdate(delta);
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

    /** 마우스가 캔바스를 벗어나면 호출
     * @param {Phaser.Input.Pointer} pointer */
    onCanvasOut(pointer)
    {
        if(this._clickedLine || this._mouseDown) {
            this.cancelMouseInputCapture();
        }
    }

    ////

    cancelMouseInputCapture()
    {
        this._mouseDown = false;
        this._clickedLine = null;
    }

    startMouseInputCapture(x, y)
    {
        this._mouseDown = true;
        this._clickedLine = new ClickedLine(this, x, y);
    }

    updateMouseInputCapture(pt_x, pt_y)
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

    closeMouseInputCapture(ptx, pty)
    {
        this._mouseDown = false;

        if(!this._clickedLine) { return; }

        this._clickedLine.close();

        this._clickLineArr.push(this._clickedLine);
        let tm_line = this._clickedLine;
        this._clickedLine = null;

        this._movingObj2.rotationSet(tm_line.rotationGet());
        this._movingObj2.moveParamSet2(tm_line.line.getPointA(), tm_line.line.getPointB(), 5, true, () => { console.log('landed'); });

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



