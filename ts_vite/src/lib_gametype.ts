
import Phaser from "phaser";

/** xy를 사용하기 위한 간단한 클래스. Phaser.Math.Vector2 대용 */
class XY
{
    x:number = -1;

    y:number = -1;

    constructor(x_ = -1, y_ = -1)
    {
        this.x = x_; this.y = y_;
    }

    get width() { return this.x; }
    set width(value) { this.x = value; }

    get height() { return this.y; }
    set height(value) { this.y = value; }

    set(x:number, y:number) { this.x = x; this.y = y; }

    /**
     * @return {boolean}
     */
    isEqual(otherXy:XY) { return otherXy.x === this.x && otherXy.y === this.y; }
    is_equal(otherXy:XY) { return this.isEqual(otherXy); }

    copyTo(otherXy:XY) { otherXy.x = this.x; otherXy.y = this.y; }
    copy_to(otherXy:XY) { this.copyTo(otherXy); }

    copyFrom(otherXy:XY) { this.x = otherXy.x; this.y = otherXy.y; }
    copy_from(otherXy:XY) { this.copyFrom(otherXy); }

    to_string() { return this.toString(); }
    toString() { return '(' + this.x.toFixed(2) + ',' + this.y.toFixed(2) + ')'; }

    clone_to_v2() { return new Phaser.Math.Vector2(this.x, this.y); }
}

function xy_2_str(x:number, y:number)
{
    return '(' + x + ',' + y + ')';
}

function vec2_2_str(vec2:Phaser.Math.Vector2)
{
    return '(' + vec2.x.toFixed(4) + ',' + vec2.y.toFixed(4) + ')';
}



export { XY, xy_2_str, vec2_2_str };