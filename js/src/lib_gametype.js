/* eslint-disable no-unused-vars */

import Phaser from 'phaser'

/** xy를 사용하기 위한 간단한 클래스. Phaser.Math.Vector2 대용 */
class XY
{
    /** @type {number} */
    x = -1;

    /** @type {number} */
    y = -1;

    constructor(x_ = -1, y_ = -1)
    {
        this.x = x_; this.y = y_;
    }

    get width() { return this.x; }
    set width(value) { this.x = value; }

    get height() { return this.y; }
    set height(value) { this.y = value; }

    set(x_, y_) { this.x = x_; this.y = y_; }

    /**
     * @param {XY} [otherXy]
     * @return {boolean}
     */
    is_equal(otherXy) { return otherXy.x === this.x && otherXy.y === this.y; }

    /** @param {XY} [otherXy] */
    copy_to(otherXy) { otherXy.x = this.x; otherXy.y = this.y; }

    /** @param {XY} [otherXy] */
    copy_from(otherXy) { this.x = otherXy.x; this.y = otherXy.y; }

    /** @param {Phaser.Math.Vector2} [fromV2] */
    copy_from_v2(fromV2) { this.x = fromV2.x; this.y = fromV2.y; }

    clone_to_v2() { return new Phaser.Math.Vector2(this.x, this.y); }

    to_string() { return '(' + this.x + ',' + this.y + ')'; }
    toString() { return this.to_string(); }
}

/**
 * @param {number} [x]
 * @param {number} [y]
 */
function xy_2_str(x, y)
{
    return '(' + x + ',' + y + ')';
}

/** @param {Phaser.Math.Vector2} [vec2] */
function vec2_2_str(vec2)
{
    return '(' + vec2.x.toFixed(4) + ',' + vec2.y.toFixed(4) + ')';
}


export { XY, xy_2_str, vec2_2_str };