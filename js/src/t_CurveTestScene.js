// @ts-nocheck
/* eslint-disable no-unused-vars */
import Phaser from 'phaser'
import { TickPlay } from './TickPlay';
import { vec2_2_str, XY } from './lib_gametype';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//#region [참고용 웹 링크]
/*

// class doc
// - graphics : https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Graphics.html
// example
// - geom : http://phaser.io/examples/v3/category/geom

// https://phaser.io/examples/v3/view/game-objects/graphics/obj-scene

// 입력
// - InputManager : https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputPlugin.html
// - setInteractive : https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObject.html#setInteractive__anchor
// example
// - https://phaser.io/examples/v3/view/game-objects/dom-element/input-test
// - https://phaser.io/examples/v3/category/input
// - game-objects/dom-element/InputTest
// - https://phaser.io/examples/v3/search?search=input

// ex1
graphics.lineStyle(5,0xFF00FF,1.0);
graphics.beginPath();
graphics.moveTo(100,100);
graphics.lineTo(200,200);
graphics.closePath();
graphics.strokePath();

// ex2
graphics.lineStyle(5,0xFF00FF, 1.0);
graphics.fillStyle(0xFFFFFF, 1.0);
graphics.fillRect(50, 50, 400, 200);
graphics.strokeRect(50, 50, 400, 200);

// 입력처리
var sprite = this.add.sprite(x, y, texture);
sprite.setInteractive();
sprite.on('pointerdown', callback, context);

*/
//#endregion

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ManualUpdateArray 
{
    /** @type {ManualUpdate[]} */
    _objectArray = null;

    /** @type {ManualUpdateArray} 인스턴스. 쓸까 지울까? */
    InstG = null;

    constructor() {
        this.InstG = this;
        this._objectArray = [];
    }

    add(obj) {
        obj.setCaller(this);
        obj.start();
        this._objectArray.push(obj);
        this.dbglog();
    }
    del(obj) {
        let i = this._objectArray.findIndex(v => v === obj);
        if(i !== -1) {
            this._objectArray.splice(i, 1);
            this.dbglog();
        }
    }
    dbglog() {
        console.log('this._objectArray:len: ', this._objectArray.length);
    }
     /**
     * @virtual
     * @param {number} time current time
     * @param {number} delta delta time
     */
     updateAll(time, delta) {
        this._objectArray.forEach((v, i, arr) => v.update(time, delta));
    }
}

export  class ManualUpdate
{
    /** @type {ManualUpdateArray} */
    _updateCaller = null;
    /** @type {boolean} */
    _started = false;
    /** @type {(time, delta) => void} */
    _onUpdate = null;

    constructor() {
        this._started = false;
    }
    /** virtual 
     * @param {ManualUpdateArray} updater
     */
    start() {
        this._started = true;
    }
    /** virtual 
     * @param {boolean} delSelf
     */
    stop(delSelf) {
        this._started = false;
        if(delSelf) {
            this._updateCaller.del(this);
        }
    }
    setCaller(updateCaller) {
        this._updateCaller = updateCaller;
    }
    /** @virtual
     * @param {number} time current time
     * @param {number} delta delta time
     */
    update(time, delta) {
        this.onUpdate(time, delta)
    }

    setCallback(updateCallback) {
        this._onUpdate = updateCallback;
    }
    onUpdate(time, delta) {
        this._onUpdate && this._onUpdate(time, delta);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export class CurveTestScene extends Phaser.Scene
{
    /** @type {CurveTestScene} */
    static instance = undefined;

    /** @type {TickPlay} */
    _tickPlay = null;

    /** @type {UI_TextButton} */
    _dbgTxtBtnArr = null;

    /** @type {ManualUpdateArray} */
    _updateArr = null;

    /** @type {Phaser.GameObjects.Graphics} */
    _graphics = null;

    constructor()
    {
        super('CurveTestScene');
        CurveTestScene.instance = this;

        /** @type {Phaser.GameObjects.Graphics} */
        this._graphics      = null;
        this.lineDataArr    = undefined;
        this.lineObjIndex   = 0;
        this.lineObjArr     = undefined;
        this.dotDataArr     = undefined;
        this.dotObjIndex    = 0;
        this.dotObjArr      = undefined;
        this._updateArr     = new ManualUpdateArray();
        this._tickPlay      = new TickPlay();
        console.log(this.constructor.name, ': done');
    }

    preload()
    {
        this.load.image('click_box', './assets/16x16.png');
    }

    create()
    {
        this._graphics = this.add.graphics(); // this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

        this.lineDataArr = [
            { fillStyle:{color:0xffffff, size:1, alpha:1.0 }, from:{x:0, y:0}, to:{x:100, y:200 } },
            { fillStyle:{color:0xff0000, size:1, alpha:1.0 }, from:{x:200, y:50}, to:{x:200, y:400} }
        ];
        this.lineObjArr = [];

        this.dotDataArr = [
            { fillStyle:{color:0xff00ff, size:10, alpha:1.0 }, to:{x:100, y:200 } },
        ];
        this.dotObjArr = [];

        this.clickBox1 = this.add.image(100, 100, 'click_box');
        this.clickBox1.setInteractive();
        this.input.setDraggable(this.clickBox1);

        //setInteractive() 설정된 게임 오브젝트는 모두 움직인다.
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('pointerup', this.onPointerUp.bind(this));

        this.makeTextButton();

        // tick play - start
        this._tickPlay.start();
    }

    makeTextButton()
    {
        let x = 5;
        let y = 5; 
        let yStep = 20;

        this._dbgTxtBtnArr = [];

        let btn = new UI_TextButton(this, "[Lerp 1D]", x, y, null, () => { this.run_lerpTest_1(); });
        y += yStep;

        btn = new UI_TextButton(this, "[Lerp 2D]", x, y, null, () => { this.run_lerpTest_2(); });
        y += yStep;

        btn = new UI_TextButton(this, "[Pt3 Bz 1]", x, y, null, () => { this.run_pt3_bezier_1(); });
        y += yStep;

        btn = new UI_TextButton(this, "[Pt4 Bz 1]", x, y, null, () => { this.run_pt4_bezier_1(); });
        y += yStep;
    }

    getLine()
    {
        if(this.lineObjIndex >= this.lineObjArr.length) {
            this.lineObjArr.push(new Phaser.Geom.Line(0, 0, 0, 0));
        }
        let a_line = this.lineObjArr[this.lineObjIndex];
        this.lineObjIndex++;
        return a_line;
    }

    getDot()
    {
        if(this.dotObjIndex >= this.dotObjArr.length) {
            this.dotObjArr.push(new Phaser.Geom.Point(0, 0));
        }
        let obj = this.dotObjArr[this.dotObjIndex];
        this.dotObjIndex++;
        return obj;
    }

    /**
     * @param {number} time current time
     * @param {number} delta delta time
     */
    update(time, delta)
    {
        //console.log('update > ', time, ',', delta);
        this._graphics.clear();

        this.lineObjIndex = 0;
        this.dotObjIndex = 0;
        for(let i = 0; i < this.lineDataArr.length; i++)
        {
            let line = this.getLine();
            let spec = this.lineDataArr[i];
            line.x1 = spec.from.x;
            line.y1 = spec.from.y;
            line.x2 = spec.to.x;
            line.y2 = spec.to.y;

            this._graphics.lineStyle(spec.fillStyle.size, spec.fillStyle.color, spec.fillStyle.alpha);
            this._graphics.strokeLineShape(line);
        }

        for(let i = 0; i < this.dotDataArr.length; i++)
        {
            let dot = this.getDot();
            let spec = this.dotDataArr[i];
            dot.x = spec.to.x;
            dot.y = spec.to.y;

            this._graphics.fillStyle(spec.fillStyle.color, spec.fillStyle.alpha);
            this._graphics.fillPointShape(dot, spec.fillStyle.size);
        }

        this._updateArr.updateAll(time, delta);
    }

    /** @param {Phaser.Input.Pointer} pointer */
    onPointerUp(pointer)
    {
        let lbtn_up = pointer.leftButtonReleased();
        console.log('PT:' + vec2_2_str(pointer));
    }


    run_lerpTest_1() {
        let lerp_1 = new Lerp1D();
        lerp_1.setParam(2, -2);
        this._updateArr.add(lerp_1);
    }
    run_lerpTest_2() {
        let lerp_2 = new Lerp2D();
        lerp_2.setParam(100, 20, 400, 400, 0.05);
        lerp_2.setCallback((time, delta) => {
            this.clickBox1.x = lerp_2.get_x();
            this.clickBox1.y = lerp_2.get_y();
        });
        this._updateArr.add(lerp_2);
    }
    run_pt3_bezier_1() {
        let pt3bz = new Point3Bezier();
        pt3bz.setParam(60, 535, 330, 215, 616, 535, 0.05);
        pt3bz.setCallback((time, delta) => {
            this.clickBox1.x = pt3bz.get_x();
            this.clickBox1.y = pt3bz.get_y();
        });
        this._updateArr.add(pt3bz);
    }
    run_pt4_bezier_1() {
        let pt4bz = new Point4Bezier1();
        pt4bz.setParam(69, 676, 165, 460, 482, 455, 570, 676, 0.05);
        pt4bz.setCallback((time, delta) => {
            this.clickBox1.x = pt4bz.get_x();
            this.clickBox1.y = pt4bz.get_y();
        });
        this._updateArr.add(pt4bz);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ClickLocationGuide
{
    /** @type {Phaser.Scene} */
    _scene = null;
    /** @type {string[]} */
    _stepMsg = null; // string[]
    /** @type {number} */
    _playIdx = 0;
    /** @type {XY[]} */
    _xyArr = null; // XY[]
    /** @type {boolean} */
    _isWorking = false;
    /** @type {TickPlay} */
    _tickPlayer = null;
    /** @type {Phaser.GameObjects.Text} */
    _text = null;

    /** @param {Phaser.Scene} scene  */
    constructor(scene)
    {
        this._scene = scene;
    }

    getActive() { return this._isWorking; }
    setTickPlayer(tp) { this._tickPlayer = tp; }
    /** @param {Phaser.GameObjects.Text} textObj */
    setTextPlace(textObj) { this._text = textObj; }

    addStep(msg) {
        if(!this._stepMsg) {
            this._stepMsg = [];
        }
        this._stepMsg.push(msg);
    }

    async playStep() {
        this._isWorking = true;
        this._xyArr = [];
        this._scene.input.on('pointerdown', this.onPointerDown.bind(this));
        this._scene.input.on('pointerup', this.onPointerUp.bind(this));
        this._playIdx = 0;
        this._isWorking = false;

        // 끝나면 틱플로 셀프 삭제
    }

    async playOneStep(idx) {
        // show text some where
        this._text.setText(this._stepMsg[idx]);
        // wait input
    }

    /** @param {Phaser.Input.Pointer} pointer */
    onPointerUp(pointer)
    {
        let lbtn_up = pointer.leftButtonReleased();
        if(this._mouseDown && lbtn_up) {
            this.closeMouseInputCapture(pointer.x, pointer.y);
        }
    }
}

/**
 * @param {Phaser.Scene} scene 
 */
async function startLerp2D_ClickLocationGuide(scene)
{
    let guide = new ClickLocationGuide(scene);

    guide.addStep('Press anywhere');
    guide.addStep('Press anywhere');
    guide.addStep('Press anywhere');

    await guide.playStep();

    let click_pos = guide.getClickedLocations();
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 일반 숫자 A->B로 보간되는 과정 처리 클래스 */
class Lerp1D extends ManualUpdate
{
    constructor()
    {
        super();
        this.p0 = 0;
        this.p0_ing = 0;
        this.p1 = 0;
        this.t = 0;
        this.tstep = 0.1;
    }

    setParam(p0, p1)
    {
        this.p0 = p0;
        this.p0_ing = p0;
        this.p1 = p1;
        this.t = 0;
    }

    update(time, delta)
    {
        if(this.t > 1) {
            console.log('> dead-self');
            this.stop(true);
            return false;
        }

        if(this._started) {
            this.p0_ing = lerp_1(this.p0, this.p1, this.t);
            this.realWork(time, delta);
            this.t += this.tstep;
        }
        return true;
    }

    realWork(time, delta)
    {
        let str1 = ' p0:' + this.p0.toFixed(2) + ' -> p1:' + this.p1.toFixed(2);
        console.log.apply(console, ['Lerp1D: p0_ing:', this.p0_ing.toFixed(2), ', t:',this.t.toFixed(2), ', ', str1 ]);
        this.onUpdate(time, delta);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** XY 클래스값을 A->B로 보간되는 과정 처리 클래스 */
class Lerp2D extends ManualUpdate 
{
    /** @type {XY} */
    p0 = new XY();

    /** @type {XY} */
    p0_ing = new XY();

    /** @type {XY} */
    p1 = new XY();

    /** @type {number} */
    t = 0;

    /** @type {number} */
    tstep = 0;
    
    constructor()
    {
        super();
        this.p0.set(0,0);
        this.p0_ing.set(0,0);
        this.p1.set(0,0);
        this.t = 0;
        this.tstep = 0.1;
    }
    
    get_x() { return this.p0_ing.x; }
    get_y() { return this.p0_ing.y; }


    setParam(x1, y1, x2, y2, tStep)
    {   
        this.p0.set(x1, y1);
        this.p0_ing.set(x1, y1);
        this.p1.set(x2, y2);
        this.t = 0;
        this.tstep = tStep ? tStep : 0.1;
    }

    update(time, delta)
    {
        //if(Math.floor(this.t) > 1) { // 테스트해볼 코드 > 한단계 남겨두고 멈춰서 못쓸것
        // this.t 가 부동소수점으로 (1.0000000000000002 가 되어서 1보다 큰 경우가 있음)
        //if(this.t >= (1 + this.tstep)) {
        if(this.t > 1.01) {
            console.log('> Lerp2D:dead-self');
            this.stop(true);
            return false;
        }

        if(this._started) {
            lerp_2(this.p0, this.p1, this.t, this.p0_ing);
            this.realWork(time, delta);
            this.t += this.tstep;
            //console.log(this.t);
        }
        return true;
    }

    realWork(time, delta)
    {
        console.log.apply(console, ['Lerp2D:p0_ing:', this.p0_ing.toString(), ', t:',this.t.toFixed(2), ', p0:', this.p0.toString(), ', p1:', this.p1.toString()]);
        this.onUpdate(time, delta);
    }
}

class Point3Bezier extends ManualUpdate 
{
    /** @type {XY} */
    pt_ing = new XY();

    /** @type {XY} */
    p0 = new XY();

    /** @type {XY} */
    p1 = new XY();

    /** @type {XY} */
    p2 = new XY();

    /** @type {number} */
    t = 0;

    /** @type {number} */
    tstep = 0;
    
    constructor()
    {
        super();
        this.pt_ing.set(0,0);
        this.p0.set(0,0);
        this.p1.set(0,0);
        this.p2.set(0,0);
        this.t = 0;
        this.tstep = 0.1;
    }
    get_x() { return this.pt_ing.x; }
    get_y() { return this.pt_ing.y; }


    setParam(x1, y1, x2, y2, x3, y3, tStep)
    {   
        this.pt_ing.set(x1, y1);
        this.p0.set(x1, y1);
        this.p1.set(x2, y2);
        this.p2.set(x3, y3);
        this.t = 0;
        this.tstep = tStep ? tStep : 0.1;
    }

    update(time, delta)
    {
        if(this.t > 1) {
            console.log('> Point3Bezier:dead-self');
            this.stop(true);
            return false;
        }

        if(this._started) {
            point3_bezier_1(this.p0, this.p1, this.p2, this.t, this.pt_ing);
            this.realWork(time, delta);
            this.t += this.tstep;
            //console.log(this.t);
        }
        return true;
    }

    realWork(time, delta)
    {
        console.log.apply(console, ['Point3Bezier:pt_ing:', this.pt_ing.toString(), '(',this.t.toFixed(2), ') p0:', this.p0.toString(), ', p1:', this.p1.toString(), ', p2:', this.p2.toString()]);
        this.onUpdate(time, delta);
    }
}

class Point4Bezier1 extends ManualUpdate 
{
    /** @type {XY} */
    pt_ing = new XY();

    /** @type {XY} */
    p0 = new XY();

    /** @type {XY} */
    p1 = new XY();

    /** @type {XY} */
    p2 = new XY();

    /** @type {XY} */
    p3 = new XY();

    /** @type {number} */
    t = 0;

    /** @type {number} */
    tstep = 0;
    
    constructor()
    {
        super();
        this.pt_ing.set(0,0);
        this.p0.set(0,0);
        this.p1.set(0,0);
        this.p2.set(0,0);
        this.p3.set(0,0);
        this.t = 0;
        this.tstep = 0.1;
    }

    get_x() { return this.pt_ing.x; }
    get_y() { return this.pt_ing.y; }


    setParam(x1, y1, x2, y2, x3, y3, x4, y4, tStep)
    {   
        this.pt_ing.set(x1, y1);
        this.p0.set(x1, y1);
        this.p1.set(x2, y2);
        this.p2.set(x3, y3);
        this.p3.set(x4, y4);
        this.t = 0;
        this.tstep = tStep ? tStep : 0.1;
    }

    update(time, delta)
    {
        if(this.t > 1) {
            console.log('> Point3Bezier:dead-self');
            this.stop(true);
            return false;
        }

        if(this._started) {
            point4_bezier_1(this.p0, this.p1, this.p2, this.p3, this.t, this.pt_ing);
            this.realWork(time, delta);
            this.t += this.tstep;
        }
        return true;
    }

    realWork(time, delta)
    {
        this.onUpdate(time, delta);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {number} v1 시작 숫자값
 * @param {number} v2 종료 숫자값
 * @param {number} t 0~1 사이의 진행 값
 * @returns 보간 결과
 */
function lerp_1(v1, v2, t)
{
    return v1 + ((v2 - v1) * t); // 기본 그대로 사용

    //return v1 * t + v2;               //type-0
    //return ((1-t) * v1) + (t * v2);   //type-1
}

/**
 * @param {XY} v1
 * @param {XY} v2
 * @param {number} t
 * @param {XY} out
 * @returns 보간결과 out을 그대로 리턴
 */
function lerp_2(v1, v2, t, out)
{
    out = out ? out : new XY(v1.x, v1.y);
    let nx = lerp_1(v1.x, v2.x, t);
    let ny = lerp_1(v1.y, v2.y, t);
    //console.log.apply(console, [' > ', v1.toString(), ',', nx.toFixed(2), ',', ny.toFixed(2)]);
    out.set(nx, ny);
    return out;
}


/** lerp_2만 써서, 점 3개짜리 곡선 움직임 찾기 */
function point3_bezier_1(p0, p1, p2, t, out)
{
    out = out ? out : new XY(p0.x, p0.y);
    let a = lerp_2(p0, p1, t);
    let b = lerp_2(p1, p2, t);
    lerp_2(a, b, t, out);
    return out;
}

/*
---------------------------------------
	B
    
A		C

1) A->B : ((1-t)A + tB)
2) B->C : ((1-t)B + tC)
3) AB->BC : (1-t)((1-t)A + tB) + t((1-t)B + tC)

---------------------------------------

= (1-t)²A + t(1-t)B + t(1-t)B + t²C
= (1-t)²A + 2t(1-t)B + t²C

---------------------------------------
*/

/**
 * 
 * @param {Phaser.Math.Vector2} p0 
 * @param {Phaser.Math.Vector2} p1 
 * @param {Phaser.Math.Vector2} p2 
 * @param {number} t 
 * @param {Phaser.Math.Vector2} out 
 * @returns {Phaser.Math.Vector2} out
 */
function point3_bezier_2(p0, p1, p2, t, out)
{
    out = out ? out : new Phaser.Math.Vector2(p0.x, p0.y);
    return out;
}


/** lerp_2만 써서, 점 4개짜리 곡선 움직임 찾기 */
function point4_bezier_1(p0, p1, p2, p3, t, out)
{
    out = out ? out : new XY(p0.x, p0.y);
    
    let a = lerp_2(p0, p1, t);
    let b = lerp_2(p1, p2, t);
    let c = lerp_2(p2, p3, t);

    let e = lerp_2(a, b, t);
    let f = lerp_2(b, c, t);

    lerp_2(e, f, t, out);

    return out;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class UI_TextButton
{
    /** @type {Phaser.GameObjects.Text} */
    _text = null;

    /** @type {Phaser.GameObjects.Text} */
    _hiddenText = null;

    /** @type {() => void} */
    _onClick = null;

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {JSON} style
     * @param {function} onClickResponse
     */
    constructor(scene, text, x, y, style, onClickResponse)
    {
        this.init(scene, text, x, y, style, onClickResponse);
    }

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {JSON} style
     * @param {function} onClickResponse
     */
    init(scene, text, x, y, style, onClickResponse)
    {
        x = x ? x : 0;
        y = y ? y : 0;
        style = style ? style : { color: '#00ff00' };

        if(onClickResponse) {
            this._onClick = onClickResponse;
        }

        this._text = scene.add.text(x, y, text);
        this._text.setInteractive();

        this._text.on('pointerdown', () => {
            console.log('on click');
            this._onClick && this._onClick();
        });

        this._hiddenText = scene.add.text(x, y, text);
        this._hiddenText.active = false;
    }

    setPosition(x, y) {
        this._text.setPosition(x, y);
        this._hiddenText.setPosition(x, y);
    }

    /** @param {Function} onClickResponse */
    setClickCallback(onClickResponse) {
        this._onClick = onClickResponse;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

