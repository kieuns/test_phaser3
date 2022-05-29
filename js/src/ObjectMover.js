
import Phaser from 'phaser'
import { vec2_2_str } from './lib_gametype';
import { log } from './log';

export class ObjectMover
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
    moveParamSet(sx, sy, dx, dy, speed, moveStart, func)
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
    moveParamSet2(v2s, v2e, speed, moveStart, func)
    {
        this.moveParamSet(v2s.x, v2s.y, v2e.x, v2e.y, speed, moveStart, func);
    }

    /** update() 같은 주기 함수에서 호출해줘야 한다.
     * @param {number} dt - unit:sec */
    onMove(dt)
    {
        if(!this._moveStart) { return; }

        let moved_dir = this._posTo.clone().subtract(this._posFrom).normalize();



        this._movingProgress += (this._movePercentUnit * dt);
        this._movingProgress = Math.min(1, this._movingProgress);

        moved_dir.scale(this._movingProgress);

        this._posCurrent.set(this._posFrom.x + (this._moveDistance * moved_dir.x), this._posFrom.y + (this._moveDistance * moved_dir.y));
        this._sprite.setPosition(this._posCurrent.x, this._posCurrent.y);

        if(log.toomuch) {
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

}
