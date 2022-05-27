
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

// function get_func_name() {
//     return get_func_name.caller.name
// }


export { XY, xy_2_str };