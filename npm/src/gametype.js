/* eslint-disable no-unused-vars */

import Phaser from 'phaser'

class XY
{
    /** number */
    x = -1;
    /** number */
    y = -1;
    constructor(x_ = -1, y_ = -1)
    {
        this.x = x_; this.y = y_;
    }
    get width() { return this.x; }
    get height() { return this.y; }
    set width(value) { this.x = value; }
    set height(value) { this.y = value; }

    set(x_, y_) { this.x = x_; this.y = y_; }
    /** @param {XY} otherXy */
    copyTo(otherXy) { otherXy.x = this.x; otherXy.y = this.y; }
    copyFrom(otherXy) { this.x = otherXy.x; this.y = otherXy.y; }
    /**
     * @param {XY} otherXy
     * @return {boolean}
     */
    isEqual(otherXy) { return otherXy.x === this.x && otherXy.y === this.y; }
    toString() { return '(' + this.x + ',' + this.y + ')'; }
}

function xy_2_str(x, y)
{
    return '(' + x + ',' + y + ')';
}

/** @param {Phaser.Math.Vector2} [vec2] */
function vec2_2_str(vec2)
{
    return '(' + vec2.x.toFixed(4) + ',' + vec2.y.toFixed(4) + ')';
}

// function get_func_name() {
//     return get_func_name.caller.name
// }


export { XY, xy_2_str, vec2_2_str };