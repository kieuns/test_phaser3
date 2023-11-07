import { vec2_2_str } from "./lib_gametype";
import { log } from "./log";

export class ObjectMover
{
    protected sprite: Phaser.GameObjects.Image = null;

    protected posFrom: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

    protected posTo: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

    protected posCurrent = new Phaser.Math.Vector2();

    /** 기본 회전 상태 */
    protected rotationCorrection: number = 0;

    /** @type {boolean} */
    protected moveStart = false;

    /** @type {number} 이동할 속도. 픽셀 단위. Pixel Per Sec */
    protected moveSpeed = 0;

    /** @type {number} 이동할 거리. 픽셀단위. */
    protected moveDistance = 0;

    /** @type {number} 0~1 사이의 퍼센트 기준으로 #moveSpeed는 몇 %인가? */
    protected movePercentUnit = 0;

    /** @type {number} 0~1 사이의 퍼센트. 현재 이동한 %는? */
    protected movingProgress = 0;

    /** @type {function} [_callWhenFinish] - 움직임 끝났을때 호출할 함수, 형식은 > () => {} */
    protected callWhenFinish = null;

    spriteGet(): Phaser.GameObjects.Image
    {
        return this.sprite;
    }

    initWith(spriteObj: Phaser.GameObjects.Image)
    {
        this.sprite = spriteObj;
    }

    /**
     * @param {number} rad - 기본회전상태. 0도는 오른쪽(1,0) 방향인데 이미지의 회전상태값을 저장해둔다.
     */
    rotationCorrectionSet(rad: number)
    {
        this.rotationCorrection = rad;
        console.log('spr:', this.sprite.name, ':Rotation ', this.sprite.rotation.toFixed(4));
        // 시계방향 회전인가부네
        this.sprite.rotation = rad;
    }

    /** 오브젝트를 회전 시킨다. 오른쪽((1.0))이 0도 기준. 뭔가 대충 맞긴했네.
 * @param {number} rad - 라디언각도값
 */
    rotationSet(rad)
    {
        this.sprite.rotation = (this.rotationCorrection + rad);
        //this.#sprite.rotation = (rad);
    }

    /** @param {number} rad - 라디언각도값 */
    rotationAdd(rad)
    {
        this.sprite.rotation += rad;
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
        this.posFrom.set(sx, sy);
        this.posTo.set(dx, dy);
        this.posCurrent.set(0, 0);

        this.moveSpeed = speed;
        this.moveDistance = this.posTo.clone().subtract(this.posFrom).length();
        this.movePercentUnit = this.moveSpeed / this.moveDistance;

        this.movingProgress = 0;

        if(moveStart) {
            this.moveStart = true;
        }

        if(func) {
            this.callWhenFinish = func;
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
        if(!this.moveStart) { return; }

        let moved_dir = this.posTo.clone().subtract(this.posFrom).normalize();

        this.movingProgress += (this.movePercentUnit * dt);
        this.movingProgress = Math.min(1, this.movingProgress);

        moved_dir.scale(this.movingProgress);

        this.posCurrent.set(this.posFrom.x + (this.moveDistance * moved_dir.x), this.posFrom.y + (this.moveDistance * moved_dir.y));
        this.sprite.setPosition(this.posCurrent.x, this.posCurrent.y);

        if(log.toomuch) {
            console.log.apply(console, [
                'from: ', vec2_2_str(this.posFrom),
                ' to: ', vec2_2_str(this.posTo),
                ' cnt: ', vec2_2_str(this.posCurrent),
                ' progress: ', this.movingProgress]);
        }

        if(this.movingProgress >= 1) {
            this.moveStart = false;
            if(this.callWhenFinish) {
                this.callWhenFinish();
            }
        }
    }

}
