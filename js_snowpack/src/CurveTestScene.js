// zts-nocheck
/* eslint-disable no-unused-vars */
import Phaser from 'phaser'
import { TickPlay } from './TickPlay';
import { vec2_2_str, XY } from './lib_gametype';
import { UI_Button, UI_TextButton } from './lib_ui';

// 추가문서는, CurveTestScene.md

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 매뉴얼 업데이터

/** ManualUpdate 배열 저장, 이터레이션 처리 */
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

    /** @param {ManualUpdate} obj */
    add(obj) {
        obj.setUpdateCaller(this);
        obj.start();
        this._objectArray.push(obj);
        this.dbglog();
    }
    /** @param {ManualUpdate} obj */
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
    manualUpdate(time, delta) {
        this._objectArray.forEach((v, i, arr) => v.update(time, delta));
    }
}

export class ManualUpdate
{
    /** @type {ManualUpdateArray} */
    _updateCaller = null;
    /** @type {boolean} */
    _started = false;
    /**  update()에서 호출하는 주기마다 뭔가 하는 함수(콜백)
     * @type {(time, delta) => void} */
    _externalUpdate = null;

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
    /** @param {ManualUpdateArray} updateCaller */
    setUpdateCaller(updateCaller) {
        this._updateCaller = updateCaller;
    }
    /** @param {(time, delta) => void} updateCallback */
    setWorkCallback(updateCallback) {
        this._externalUpdate = updateCallback;
    }
    updateExternalCallback(time, delta) {
        this._externalUpdate && this._externalUpdate(time, delta);
    }
    /** @virtual
    * @param {number} time current time
    * @param {number} delta delta time
    */
     update(time, delta) {
        this.updateExternalCallback(time, delta)
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 페이져 그래픽 오브젝트 풀

export class PhaserGraphicObjectPool
{
    /** @type {Phaser.Scene} */
    _scene = null;
    /** @type {Phaser.GameObjects.Graphics} */
    _graphics = null;

    /** @type {Json[]} */
    _lineDataArr    = undefined;
    _lineObjIndex   = 0;
    /** @type {Phaser.Geom.Line[]} */
    _lineObjArr     = undefined;

    /** @type {Json[]} */
    _dotDataArr     = undefined;
    _dotObjIndex    = 0;
    /** @type {Phaser.Geom.Point[]} */
    _dotObjArr      = undefined;

    /** @type {TickPlay} */
    _tickPlayer = null;

    /** @param {Phaser.Scene} scene */
    constructor(scene) {
        this._scene = scene;
        this.init();
    }
    /** @param {Phaser.Scene} scene */
    init(scene) {
        this._scene = scene? scene : this._scene;
        this._lineDataArr = [];
        this._lineObjIndex = 0;
        this._lineObjArr = [];
        this._dotDataArr = [];
        this._dotObjIndex = 0;
        this._dotObjArr = [];

        // this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });
        this._graphics = this._scene.add.graphics();
    }

    setTickPlayer(tp) {
        this._tickPlayer = tp;
    }

    /** @param {JsonObject} jsonData
     * @example
     * const lineDataArrExam = [
     * { life:0.5, fillStyle:{color:0xffffff, size:1, alpha:1.0 }, from:{x:0, y:0}, to:{x:100, y:200 } },
     * { fillStyle:{color:0xff0000, size:1, alpha:1.0 }, from:{x:200, y:50}, to:{x:200, y:400} }
     * ];
     */
    addLine(jsonData) {
        this._lineDataArr.push(jsonData);
        if(jsonData.life && this._tickPlayer) {
            this._tickPlayer.reserveOnTime(jsonData.life, () => {
                let idx = this._lineDataArr.findIndex(elem => elem === jsonData);
                if(idx >= 0) {
                    this._lineDataArr.splice(idx, 1);
                }
            });
        }
    }
    /** @param {JsonObject[]} jsonData */
    addLines(jsonData) {
        jsonData.forEach(elem => this.addLine(elem));
    }
    /** @param {JsonObject} jsonData
     * @example
     * const dotDataArr = [
     * { life:2, fillStyle:{color:0xff00ff, size:10, alpha:1.0 }, to:{x:100, y:200 } }, ];
     */
    addDot(jsonData) {
        this._dotDataArr.push(jsonData);
        if(jsonData.life && this._tickPlayer) {
            this._tickPlayer.reserveOnTime(jsonData.life, () => {
                let idx = this._dotDataArr.findIndex(elem => elem === jsonData);
                if(idx >= 0) {
                    this._dotDataArr.splice(idx, 1);
                }
            });
        }
    }
    /** @param {JsonObject[]} jsonData */
    addDots(jsonData) {
        jsonData.forEach(elem => this.addDot(elem));
    }

    getLine()
    {
        if(this._lineObjIndex >= this._lineObjArr.length) {
            this._lineObjArr.push(new Phaser.Geom.Line(0, 0, 0, 0));
        }
        let a_line = this._lineObjArr[this._lineObjIndex];
        this._lineObjIndex++;
        return a_line;
    }
    getDot()
    {
        if(this._dotObjIndex >= this._dotObjArr.length) {
            this._dotObjArr.push(new Phaser.Geom.Point(0, 0));
        }
        let obj = this._dotObjArr[this._dotObjIndex];
        this._dotObjIndex++;
        return obj;
    }

    checkError() {
        if(!this._tickPlayer) {
            console.warn('tickPlayer need');
            return false;
        }
        return true;
    }

    manualUpdate(time, delta) {
        this._graphics.clear();

        if(!this.checkError()) { return; }

        //this._lineObjIndex = 0;
        //this._dotObjIndex = 0;
        for(let i = 0; i < this._lineDataArr.length; i++)
        {
            const line = this.getLine();
            const spec = this._lineDataArr[i];
            line.x1 = spec.from.x;
            line.y1 = spec.from.y;
            line.x2 = spec.to.x;
            line.y2 = spec.to.y;
            this._graphics.lineStyle(spec.fillStyle.size, spec.fillStyle.color, spec.fillStyle.alpha);
            this._graphics.strokeLineShape(line);
        }

        for(let i = 0; i < this._dotDataArr.length; i++)
        {
            const dot = this.getDot();
            const spec = this._dotDataArr[i];
            dot.x = spec.to.x;
            dot.y = spec.to.y;
            this._graphics.fillStyle(spec.fillStyle.color, spec.fillStyle.alpha);
            this._graphics.fillPointShape(dot, spec.fillStyle.size);
            if(spec.interactive && spec.interactive === true) {
            }

        }
    }
}

export class PhaserImageObjectPool
{
    /** @type {Phaser.Scene} */
    _scene = null;

    /** @type {JsonObject[]}
     * @example
     * { life:2, texture: 'click_box', style:{color:0xff00ff, scale:1, alpha:1.0}, to:{x:100, y:200 }, gameobject:null }
     */
    _imgJsonArr = undefined;
    /** @type {number} */
    _imgOutCount = 0;

    /** @type {TickPlay} */
    _tickPlayer = null;

    /** @param {Phaser.Scene} scene */
    constructor(scene) {
        this._scene = scene;
        this.init();
    }

    /** @param {Phaser.Scene} scene */
    init(scene) {
        this._scene = scene ? scene : this._scene;
        this._imgJsonArr = [];
        this._imgOutCount = 0;
    }

    setTickPlayer(tp) {
        this._tickPlayer = tp;
    }

     /** @param {JsonObject} jsonData
      * @returns {Phaser.GameObjects.Image}
      * @example
      * { life:2, texture: 'click_box', style:{color:0xff00ff, scale:1, alpha:1.0}, to:{x:100, y:200 }, gameobject:null }
      */
    addDot(jsonData) {
        let dot_img = this._scene.add.image(jsonData.to.x, jsonData.to.y, jsonData.texture);
        if(jsonData.style.scale) {
            dot_img.setScale(jsonData.style.scale);
        }
        jsonData.gameobject = dot_img;
        this._imgJsonArr.push(jsonData);
        if(jsonData.life && (jsonData.life > 0) && this._tickPlayer) {
            this._tickPlayer.reserveOnTime(jsonData.life, () => {
                let idx = this._imgJsonArr.findIndex(elem => elem === jsonData);
                if(idx >= 0) {
                    this._imgJsonArr[idx].gameobject.destroy();
                    this._imgJsonArr.splice(idx, 1);
                }
            });
        }
        return dot_img;
    }

    /** @return {JsonObject} */
    getDot()
    {
        if(this._imgOutCount >= this._imgJsonArr.length) {
            this.addDot({ life:1, texture: 'click_box', style:{color:0xff00ff, scale:1, alpha:1.0}, to:{x:200, y:200 }, gameobject:null });
        }
        let obj = this._imgJsonArr[this._imgOutCount];
        this._imgOutCount++;
        return obj;
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

let BezierLineTrackHelp =
{
    /** @type {number} */
    _objectLifeDur: 4,

    /** @type {PhaserGraphicObjectPool} */
    _graphicPool: null,

    /** @type {PhaserImageObjectPool} */
    _imagePool: null,

    /** @param {PhaserGraphicObjectPool} grpPool */
    setGraphicPool(grpPool) {
        this._graphicPool = grpPool;
    },

    /** @param {PhaserImageObjectPool} imgPool */
    setImagePool(imgPool) {
        this._imagePool = imgPool;
    },

    /** 
     * @param {PhaserGraphicObjectPool} grpPool
     * @param {PhaserImageObjectPool} imgPool 
     */
    setPool(grpPool, imgPool) {
        this.setGraphicPool(grpPool);
        this.setImagePool(imgPool);
    },

    /** @param {XY[]} pts */
    makeBezierSourceTrack(pts) {
        let lineData = [];
        for(let i = 0; i < pts.length-1; i++) {
            let param = { life:this._objectLifeDur, fillStyle:{color:0xffffff, size:1, alpha:1.0}, from:{x:0, y:0}, to:{x:100, y:200 } };
            param.from.x = pts[i].x;
            param.from.y = pts[i].y;
            param.to.x = pts[i+1].x;
            param.to.y = pts[i+1].y;
            this._graphicPool.addLine(param);
        }
    },

    /**
     * @param {XY[]} pts
     * @param {(XY, number, XY[])=>void} bezierCallback
     */
    makeBezierTrack(pts, bezierCallback, tstep, lineStyle) {
        let out1 = new XY();
        let out2 = new XY();
        for(let i = 0; i <= 1; i += tstep) {
            bezierCallback(out1, i, pts);
            bezierCallback(out2, i+tstep, pts);
            let line_dat = lineStyle ? lineStyle : { life:this._objectLifeDur, fillStyle:{color:0x51b300, size:1, alpha:1.0}, from:{x:0, y:0}, to:{x:100, y:200 } };;
            line_dat.from.x = out1.x;
            line_dat.from.y = out1.y;
            line_dat.to.x = out2.x;
            line_dat.to.y = out2.y;
            this._graphicPool.addLine(line_dat);
        }
    },

    /**
     * @param {XY[]} pts
     */
     makeClickPoints(pts) {
        let lineData = [];
        for(let i = 0; i < pts.length-1; i++) {
            let param = { life:this._objectLifeDur, texture:'click_box', style:{color:0xff00ff, scale:1, alpha:1.0}, to:{x:400, y:400 }, gameobject:null };
            param.to.x = pts[i].x;
            param.to.y = pts[i].y;
            this._imagePool.addDot(param);
        }
    },

    /**
     * @param {XY[]} pts
     */
    makeClickPoints_ByGrphic(pts) {
        let lineData = [];
        for(let i = 0; i < pts.length-1; i++) {
            let param = { life:this._objectLifeDur, fillStyle:{color:0xff00ff, size:10, alpha:1.0 }, to:{x:100, y:200 } };
            param.to.x = pts[i].x;
            param.to.y = pts[i].y;
            this._graphicPool.addDot(param);
        }
    },

    helperExist() { return true; }
}

/** N차 베지어 곡선을 처리할 클래스. 베지어 함수와 커브를 그릴 좌표는 지정해줘야한다.
 * @example
 * let pt4bz = new NPointsBezier( (좌표 개수) 4,  (베지어 콜백 함수) point4_bezier_2);
 * pt4bz.setStep(0.05); // t의 증가값
 * pt4bz.setPoints(69, 676, 165, 460, 482, 455, 570, 676); // x1, y1, x2, y2, ...
 * pt4bz.setWorkCallback((time, delta) => {
 *   this.clickBox1.x = pt4bz.get_x();
 *   this.clickBox1.y = pt4bz.get_y();
 * });
 * this._updateArr.add(pt4bz);
 */
class NPointsBezier extends ManualUpdate
{
    /** @type {XY} */
    pt_ing = new XY();

    /** @type {XY[]} */
    points = [];

    /** @type {number} */
    pointNum = 4;

    /** @type {number} */
    t = 0;

    /** @type {number} */
    tstep = 0;

    /** @type {number} */
    calcType = 1;

    /** xys 배열 변수를 받아서 베지어 계산을 하는 함수를 호출한다.
     * xys의 배열개수와 함수의 내용이 맞아아 문제가 없다.
     * @type {(XY, number, XY[])=>void} */
     bezierPositionCalc = null;

    /** @param {number} pointNum */
    constructor(pointNum, bezierCalcCallback)
    {
        super();
        this.pointNum = pointNum;
        this.pt_ing.set(0,0);
        for(let i = 0; i < this.pointNum; i++) {
            let nx = new XY();
            nx.set(0,0);
            this.points.push(nx);
        }
        this.t = 0;
        this.tstep = 0.1;
        this.bezierPositionCalc = bezierCalcCallback;
    }

    get_x() { return this.pt_ing.x; }
    get_y() { return this.pt_ing.y; }

    /** @param {number} tStep */
    setStep(tStep) {
        this.t = 0;
        this.tstep = tStep ? tStep : 0.1;
    }

    // 나머지 매개 변수 : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/rest_parameters
    /**
     * @param {number} tStep
     * @param {XY[]} ...xys. (x1, y1, x2, y2, x3, y3, ...) (x,y 순서의 좌표값)
     */
    setPoints(...xys) {
        this.pt_ing.set(xys[0], xys[1]);
        console.log('NPointsBezier: setPoints: ParamCnt: ' + xys.length);
        if((xys.length % 2) !== 0) {
            console.warn('NPointsBezier: ...xys length : not even');
        }
        let ar_idx = 0;
        for(let i = 0; i < xys.length; i += 2) {
            let x = xys[i];
            let y = xys[i+1];
            this.points[ar_idx].set(x, y);
            ar_idx++;
        }

        if(this.helperExist) {
            this.makeBezierSourceTrack(this.points);
            this.makeBezierTrack(this.points, this.bezierPositionCalc, this.tstep);
            this.makeClickPoints(this.points);
        }
    }

    update(time, delta) {
        if(this.t > 1) {
            console.log('> NPointsBezier:dead-self');
            this.stop(true);
            return false;
        }

        if(this._started) {
            this.bezierPositionCalc(this.pt_ing, this.t, this.points);
            this.updateExternalCallback(time, delta);
            this.t += this.tstep;
        }
        return true;
    }
}

// 'NPointsBezier'에 'BezierLineTrackHelp'를 붙인다
// 개별 오브젝트에 붙이기: Object.assign( <Instance>, BezierLineTrackHelp);
Object.assign(NPointsBezier.prototype, BezierLineTrackHelp);


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
        this.updateExternalCallback(time, delta);
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

        if(this.helperExist) {
            let pts = [];
            pts.push(this.p0); pts.push(this.p1);
            this.makeBezierSourceTrack(pts);
        }
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
        this.updateExternalCallback(time, delta);
    }
}
Object.assign(Lerp2D.prototype, BezierLineTrackHelp);

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

    /** @type {number} */
    calcType = 1;

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

        if(this.helperExist) {
            let pts = [];
            pts.push(this.p0); pts.push(this.p1); pts.push(this.p2);
            this.makeBezierSourceTrack(pts);
            this.makeBezierTrack(pts, point3_bezier_3, this.tstep);
        }
    }

    update(time, delta)
    {
        if(this.t > 1) {
            console.log('> Point3Bezier:dead-self');
            this.stop(true);
            return false;
        }

        if(this._started) {
            if(this.calcType === 2) {
                let a = point3_bezier_2(this.p0, this.p1, this.p2, this.t, this.pt_ing);
                this.pt_ing.x = a.x;
                this.pt_ing.y = a.y;
            }
            else {
                point3_bezier_1(this.p0, this.p1, this.p2, this.t, this.pt_ing);
            }
            this.realWork(time, delta);
            this.t += this.tstep;
            //console.log(this.t);
        }
        return true;
    }

    realWork(time, delta)
    {
        console.log.apply(console, ['Point3Bezier:pt_ing:', this.pt_ing.toString(), '(',this.t.toFixed(2), ') p0:', this.p0.toString(), ', p1:', this.p1.toString(), ', p2:', this.p2.toString()]);
        this.updateExternalCallback(time, delta);
    }
}
Object.assign(Point3Bezier.prototype, BezierLineTrackHelp);

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
    pointNum = 4;

    /** @type {number} */
    t = 0;

    /** @type {number} */
    tstep = 0;

    /** @type {number} */
    calcType = 1;

    constructor() {
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

    setParam(x1, y1, x2, y2, x3, y3, x4, y4, tStep) {
        this.pt_ing.set(x1, y1);
        this.p0.set(x1, y1);
        this.p1.set(x2, y2);
        this.p2.set(x3, y3);
        this.p3.set(x4, y4);
        this.t = 0;
        this.tstep = tStep ? tStep : 0.1;
    }

    update(time, delta) {
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

    realWork(time, delta) {
        this.updateExternalCallback(time, delta);
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
* @param {number} v1 시작 숫자값
* @param {number} v2 종료 숫자값
* @param {number} t 0~1 사이의 진행 값
* @returns 보간 결과
*/
function lerp_1(v1, v2, t)
{
    return ((1-t) * v1) + (t * v2);   //기본 그대로 사용
    //return v1 + ((v2 - v1) * t);      //type-1
    //return v1 * t + v2;               //type-0
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


/**
* @param {XY} p0
* @param {XY} p1
* @param {XY} p2
* @param {number} t
* @param {XY} out
*/
function point3_bezier_2(p0, p1, p2, t, out)
{
    out = out ? out : new XY(0, 0);
    out.x = point3_bezier_calc_1(p0.x, p1.x, p2.x, t);
    out.y = point3_bezier_calc_1(p0.y, p1.y, p2.y, t);
    return out;
}

function point3_bezier_3(out, t, pts)
{
    out = out ? out : new XY(0, 0);
    out.x = point3_bezier_calc_1(pts[0].x, pts[1].x, pts[2].x, t);
    out.y = point3_bezier_calc_1(pts[0].y, pts[1].y, pts[2].y, t);
    return out;
}


/*
-------------------------------------------------------------------------------
- 점 3개                                                                       -
-------------------------------------------------------------------------------
B
A      C

1) A->B : ((1-t)A + tB)  ->  ok
2) B->C : ((1-t)B + tC)  ->  ok
3) AB->BC : (1-t)((1-t)A + tB) + t((1-t)B + tC)  ->  ok
-------------------------------------------------------------------------------
= (1-t)²A + (1-t)tB + (1-t)tB + t²C
= (1-t)²A + 2(1-t)tB + t²C
-------------------------------------------------------------------------------
*/
function point3_bezier_calc_1(n0, n1, n2, t)
{
    return (1-t)**2*n0 + 2*t*(1-t)*n1 + t**2*n2; //ok
    //let mt = 1-t; return (mt*(mt*n0 + t*n1) + t*(mt*n1 + t*n2)); // ok
    //return n0*t**2 - 2*n1*t**2 + n2*t**2 - 2*n0*t + 2*n1*t + n0; //ok
}

/*
-------------------------------------------------------------------------------
- 점 4개                                                                       -
-------------------------------------------------------------------------------
= (1-t)³A + 3(1-t)²tB + 3(1-t)²tC + t³D
-------------------------------------------------------------------------------
*/

/** lerp_2만 써서, 점 4개짜리 곡선 움직임 찾기
 * @param {XY} p0. XY 형식의 좌표값. p0 ~ p3
 * @param {XY} out
 * @param {number} t */
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

/**
 * @param {XY} out
 * @param {number} t
 * @param {XY[]} pts. [XY, XY, XY, XY] XY 4개 있는 배열 필요. */
function point4_bezier_2(out, t, pts)
{
    out = out ? out : new XY(pts[0].x, pts[0].y);

    let a = lerp_2(pts[0], pts[1], t);
    let b = lerp_2(pts[1], pts[2], t);
    let c = lerp_2(pts[2], pts[3], t);

    let e = lerp_2(a, b, t);
    let f = lerp_2(b, c, t);

    lerp_2(e, f, t, out);

    return out;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 커브 테스트 씬 (메인)

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

    /** @type {PhaserGraphicObjectPool} */
    _graphicPool = null;

    /** @type {} */
    _imagePool = null;

    constructor()
    {
        super('CurveTestScene');
        CurveTestScene.instance = this;

        this._updateArr     = new ManualUpdateArray();
        this._tickPlay      = new TickPlay();
        console.log(this.constructor.name, ': done');
    }

    preload()
    {
        this.load.image('click_box', '/assets/16x16.png');
        this.load.image('missile_a', '/assets/missile_a.png');
    }

    create()
    {
        this.t_vector_class_test();

        this._graphicPool = new PhaserGraphicObjectPool(this);
        this._graphicPool.setTickPlayer(this._tickPlay);

        this._imagePool = new PhaserImageObjectPool(this);
        this._imagePool.setTickPlayer(this._tickPlay);

        const lineDataArr = [
            { life:0.5, fillStyle:{color:0xffffff, size:1, alpha:1.0 }, from:{x:0, y:0}, to:{x:100, y:200 } },
            { fillStyle:{color:0xff0000, size:1, alpha:1.0 }, from:{x:200, y:50}, to:{x:200, y:400} }
        ];
        const dotDataArr = [
            { life:2, interactive:true, fillStyle:{color:0xff00ff, size:10, alpha:1.0 }, to:{x:100, y:200 } },
        ];

        this.clickBox1 = this.add.image(100, 100, 'missile_a').setScale(0.3);
        this.clickBox1.setInteractive();
        this.input.setDraggable(this.clickBox1);

        //setInteractive() 설정된 게임 오브젝트는 모두 움직인다.
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('pointerup', this.onPointerUp.bind(this));

        this.makeTextButton();

        this._tickPlay.start();

        this._graphicPool.addDots(dotDataArr);
        this._graphicPool.addLines(lineDataArr);

        this._imagePool.addDot({ life:1, texture: 'click_box', style:{color:0xff00ff, scale:5, alpha:1.0}, to:{x:400, y:400 }, gameobject:null });
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

        btn = new UI_TextButton(this, "[Pt3 Bz 2]", x, y, null, () => { this.run_pt3_bezier_2(); });
        y += yStep;

        btn = new UI_TextButton(this, "[Pt4 Bz 1]", x, y, null, () => { this.run_pt4_bezier_1(); });
        y += yStep;

        let new_btn = new UI_Button(this, 0, 0, 200, 100);
        new_btn.setText("[BTN_11]");
        new_btn.setPosition( 200, 500 );
        new_btn.setClickEvent(() => { console.log('UI_Button BTN_11'); });
    }

    t_vector_class_test()
    {
        console.log('=t_vector_class_test():S');
        let v1 = new Phaser.Math.Vector2(2, 2);
        let v2 = new Phaser.Math.Vector2(4, 4);
        console.log(vec2_2_str(v1) + ':v1');
        let v3 = v1.clone().scale( 3 );
        console.log(vec2_2_str(v1) + ':v1.clone().scale( 3 )');
        console.log(vec2_2_str(v3) + ':v3');
        console.log('=t_vector_class_test():E');
    }

    /**
    * @param {number} time current time
    * @param {number} delta delta time
    */
    update(time, delta)
    {
        //console.log('update > ', time, ',', delta);
        this._graphicPool.manualUpdate(time, delta);
        this._updateArr.manualUpdate(time, delta);
    }

    /** @param {Phaser.Input.Pointer} pointer */
    onPointerUp(pointer)
    {
        let lbtn_up = pointer.leftButtonReleased();
        console.log('PT:' + vec2_2_str(pointer));
    }


    run_lerpTest_1() {
        let lerp_1 = new Lerp1D();
        lerp_1.setParam(100, -50);
        this._updateArr.add(lerp_1);
    }
    run_lerpTest_2() {
        let lerp_2 = new Lerp2D();
        if(lerp_2.helperExist) { lerp_2.setPool(this._graphicPool, this._imagePool); }
        lerp_2.setParam(100, 20, 400, 400, 0.05);
        lerp_2.setWorkCallback((time, delta) => {
            this.clickBox1.x = lerp_2.get_x();
            this.clickBox1.y = lerp_2.get_y();
        });
        this._updateArr.add(lerp_2);
    }
    run_pt3_bezier_1() {
        let pt3bz = new Point3Bezier();
        if(pt3bz.helperExist) { pt3bz.setPool(this._graphicPool, this._imagePool); }
        pt3bz.setParam(60, 535, 330, 215, 616, 535, 0.05);
        pt3bz.setWorkCallback((time, delta) => {
            this.clickBox1.x = pt3bz.get_x();
            this.clickBox1.y = pt3bz.get_y();
        });
        this._updateArr.add(pt3bz);
    }
    run_pt3_bezier_2() {
        let type = 1;
        if(type === 0)
        {
            let pt3bz = new Point3Bezier();
            pt3bz.setParam(60, 535, 330, 215, 616, 535, 0.05);
            pt3bz.calcType = 2;
            pt3bz.setWorkCallback((time, delta) => {
                this.clickBox1.x = pt3bz.get_x();
                this.clickBox1.y = pt3bz.get_y();
            });
            this._updateArr.add(pt3bz);
        }
        else if(type === 1)
        {
            let pt3bz = new NPointsBezier(3, point3_bezier_3);
            if(pt3bz.helperExist) { pt3bz.setPool(this._graphicPool, this._imagePool); }
            pt3bz.setStep(0.05);
            pt3bz.setPoints(60, 535, 330, 215, 616, 535);
            pt3bz.setWorkCallback((time, delta) => {
                this.clickBox1.x = pt3bz.get_x();
                this.clickBox1.y = pt3bz.get_y();
            });
            this._updateArr.add(pt3bz);
        }
    }
    run_pt4_bezier_1() {
        let type = 1;
        if(type === 0)
        {
            let pt4bz = new Point4Bezier1();
            pt4bz.setParam(69, 676, 165, 460, 482, 455, 570, 676, 0.05);
            pt4bz.setWorkCallback((time, delta) => {
                this.clickBox1.x = pt4bz.get_x();
                this.clickBox1.y = pt4bz.get_y();
            });
            this._updateArr.add(pt4bz);
        }
        else if(type === 1)
        {
            let pt4bz = new NPointsBezier(4, point4_bezier_2);
            if(pt4bz.helperExist) { pt4bz.setPool(this._graphicPool, this._imagePool); }
            pt4bz.setStep(0.05);
            //pt4bz.setPoints(69, 676, 165, 460, 482, 455, 570, 676);
            pt4bz.setPoints(152, 777, 137, 485, 425, 247, 715, 273);
            pt4bz.setWorkCallback((time, delta) => {
                this.clickBox1.x = pt4bz.get_x();
                this.clickBox1.y = pt4bz.get_y();
            });
            this._updateArr.add(pt4bz);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////