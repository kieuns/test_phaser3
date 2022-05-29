/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */

import Phaser from 'phaser'
import { vec2_2_str, xy_2_str } from './lib_gametype';
import { GameOption } from './main';

//=====================================================================================================================

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


    getNowTick() { return this._tickNowIndex; }

    getNowAsTime() { return this._tickNowIndex * this._tickMaxPerSec; }


    /** @param {number} expectEndTime unit:sec */
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
        if(!this._loopStarted) { console.warn('TickPlay : not started'); return; }
        let nx_tick = Math.floor(time*this._tickMaxPerSec);
        this._workTodo.push({ tick:nx_tick, func:callback, delete:false });
    }

    /**
     * @param {number} time - 예약 시간, 지금에서 얼마 뒤. ms
     * @param {function} callback - 호출 함수
     * @param {number} repeatCnt
     */
    reserveBy(time, callback, repeatCnt = 1)
    {
        if(!this._loopStarted) { console.warn('TickPlay : not started'); return; }

        let repeat_time = time;

        for(let i = 0; i < repeatCnt; i++)
        {
            let nx_tick = this._tickNowIndex+Math.ceil(time*this._tickMaxPerSec);

            if(GameOption.log_detail()) {
                console.log('tickplay : now: ', this._tickNowIndex, ' expect at : ', nx_tick, ', time:', time.toFixed(4));
            }

            this._workTodo.push({tick: nx_tick, func:callback, delete:false});

            time += repeat_time;
        }
    }
}

//=====================================================================================================================

class ObjectMover
{
    /** @type {Phaser.GameObjects.Image} */
    _sprite = null;

    /** @type {Phaser.Math.Vector2} */
    _posFrom = new Phaser.Math.Vector2();

    /** @type {Phaser.Math.Vector2} */
    _posTo = new Phaser.Math.Vector2();

    /** 현재 위치
     * @type {Phaser.Math.Vector2}
     */
    _posCurrent = new Phaser.Math.Vector2();

    /** @type {number} 기본 회전 상태 */
    _rotationCorrection = 0;

    /** @type {boolean} */
    _moveStart = false;

    /** @type {number} 이동할 속도. 픽셀 단위. Pixel Per Sec */
    _moveSpeed = 0;

    /** @type {number} 이동할 거리. 픽셀단위. */
    _moveDistance = 0;

    /** @type {number} 0~1 사이의 퍼센트 기준으로 #moveSpeed는 몇 %인가? */
    _movePercentUnit = 0;

    /** @type {number} 0~1 사이의 퍼센트. 현재 이동한 %는? */
    _movingProgress = 0;

    /** @type {function} [_callWhenFinish] - 움직임 끝났을때 호출할 함수, 형식은 > () => {} */
    _callWhenFinish = null;

    /** @returns {Phaser.GameObjects.Image} */
    spriteGet() {
        return this._sprite;
    }

    /** @param {Phaser.GameObjects.Image} spriteObj */
    initWith(spriteObj) {
        this._sprite = spriteObj;
    }

    /**
     * @param {number} rad - 기본회전상태. 0도는 오른쪽(1,0) 방향인데 이미지의 회전상태값을 저장해둔다.
     * */
    rotationCorrectionSet(rad)
    {
        this._rotationCorrection = rad;
        console.log('spr:',this._sprite.name, ':Rotation ',this._sprite.rotation.toFixed(4));
        // 시계방향 회전인가부네
        this._sprite.rotation = rad;
    }

    /** 오브젝트를 회전 시킨다. 오른쪽((1.0))이 0도 기준. 뭔가 대충 맞긴했네.
     * @param {number} rad - 라디언각도값
     */
    rotationSet(rad)
    {
        this._sprite.rotation = (this._rotationCorrection + rad);
        //this.#sprite.rotation = (rad);
    }

    /** @param {number} rad - 라디언각도값 */
    rotationAdd(rad)
    {
        this._sprite.rotation += rad;
    }


    /** 이동할 위치를 설정한다.
     * @param {number} sx
     * @param {number} sy
     * @param {number} dx
     * @param {number} dy
     * @param {function} [func] - 움직임 끝났을때 호출할 함수, 형식은 > () => {}
     */
    moveSet(sx, sy, dx, dy, speed, moveStart, func)
    {
        this._posFrom.set(sx, sy);
        this._posTo.set(dx, dy);
        this._posCurrent.set(0, 0);

        this._moveSpeed = speed;
        this._moveDistance = this._posTo.clone().subtract(this._posFrom).length();
        this._movePercentUnit = this._moveSpeed / this._moveDistance;

        this._movingProgress = 0;

        if(moveStart) {
            this._moveStart = true;
        }

        if(func) {
            this._callWhenFinish = func;
        }
    }

    /**
     * @param {Phaser.Math.Vector2} [v2s]
     * @param {Phaser.Math.Vector2} [v2e]
     * @param {number} [speed]
     * @param {boolean} [moveStart]
     * @param {function} [func] - 움직임 끝났을때 호출할 함수, 형식은 > () => {}
     */
    moveSet2(v2s, v2e, speed, moveStart, func)
    {
        this.moveSet(v2s.x, v2s.y, v2e.x, v2e.y, speed, moveStart, func);
    }

    /** @param {number} dt - unit:sec */
    onMove(dt)
    {
        if(!this._moveStart) { return; }

        let moved_dir = this._posTo.clone().subtract(this._posFrom).normalize();



        this._movingProgress += (this._movePercentUnit * dt);
        this._movingProgress = Math.min(1, this._movingProgress);

        moved_dir.scale(this._movingProgress);

        this._posCurrent.set(this._posFrom.x + (this._moveDistance * moved_dir.x), this._posFrom.y + (this._moveDistance * moved_dir.y));
        this._sprite.setPosition(this._posCurrent.x, this._posCurrent.y);

        if(GameOption.log_detail()) {
            console.log.apply(console, [
                'from: ', vec2_2_str(this._posFrom),
                ' to: ', vec2_2_str(this._posTo),
                ' cnt: ', vec2_2_str(this._posCurrent),
                ' progress: ', this._movingProgress]);

        }

        if(this._movingProgress >= 1)
        {
            this._moveStart = false;
            if(this._callWhenFinish) {
                this._callWhenFinish();
            }
        }
    }

    // /**
    //  * @param {Phaser.Math.Vector2} fromPos
    //  * @param {Phaser.Math.Vector2} toPos
    //  */
    //  moveParamSet(fromPos, toPos)
    //  {
    //      this.#fromPos = fromPos;
    //      this.#toPos = toPos;
    //  }

}

//=====================================================================================================================

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

//=====================================================================================================================

class ClickedLine
{
    /** @type {SimpleLine} */
    _simpleLine = new SimpleLine();

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
        if(GameOption.is_detail_log)
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
    _tickPlay = null;

    /** @type {ObjectMover} */
    _objMov1 = null;

    /** @type {ObjectMover} */
    _objMov2 = null;

    /** @type {array} */
    _clickLineArr = null;

    /** @type {ClickedLine} */
    _clickedLine = null;

    /** @type {boolean} */
    _shiftKeyPressed = false;

    constructor()
    {
        super('TickTest');
        TickTestScene.instance = this;
        this._mouseDown = false;
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
        // 크롬에서 안되는데 왜지?
        this.input.keyboard.on('keyup', (event) => {
            if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.SHIFT) {
                this._shiftKeyPressed = false;
                console.log('shift up');
            }
        });

        this.graphics = this.add.graphics();
    }


    /**
     * @param {number} time - unit ms
     * @param {number} delta - unit ms
     */
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

    /** 마우스가 캔바스를 벗어나면 호출
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

        this._objMov2.rotationSet(tm_line.rotationGet());
        this._objMov2.moveSet2(tm_line.line.getPointA(), tm_line.line.getPointB(), 5, true, () => { console.log('landed'); });

        this._tickPlay.reserveBy(5, (() => {
            if(GameOption.log_detail()) { console.log('ReserveWork : tick: ', this._tickPlay.getNowTick(), ', ', this._tickPlay.getNowAsTime()); }

            let idx = this._clickLineArr.findIndex((v, i, a) => v === tm_line);
            if(idx !== -1) {
                this._clickLineArr.splice(idx, 1);
                if(GameOption.log_detail()) { console.log('_clickLineArr : count : ', this._clickLineArr.length); }
            }
        }).bind(this));
    }
}



