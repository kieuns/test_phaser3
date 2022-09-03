

export class TwoDimArray
{
    _xLen = 0;
    _yLen = 0;
    _array = null;
    _initValue = null;

    init(xlen, ylen, initValue)
    {
        this._initValue = initValue ? initValue : null;

        this._xLen = xlen;
        this._yLen = ylen;
        this._array = [];

        for (let x = 0; x < this._xLen; x++) {
            let col_arr = [];
            for (let y = 0; y < this._yLen; y++) {
                col_arr.push(initValue ? initValue : null);
            }
            this._array.push(col_arr);
        }
    }

    reset()
    {
        this._array.forEach(in_arr => in_arr.fill(this._initValue));
    }

    get(x, y)
    {
        if (x < 0 || y < 0 || x >= this._xLen || y >= this._yLen) { return null; }
        return this._array[x][y];
    }

    set(x, y, value)
    {
        if (x < 0 || y < 0 || x >= this._xLen || y >= this._yLen) { return false; }
        this._array[x][y] = value;
        return true;
    }

    dumpLog(strTitle)
    {
        if(strTitle) { console.log('[ ',strTitle,' ]'); }
        let msg_2 = '  : ';
        for (let x = 0; x < this._xLen; x++) {
            msg_2 += '(X ' + x + ')';
        }

        console.log(msg_2);
        for (let y = 0; y < this._yLen; y++) {
            let msg_1 = 'Y'+y+': ';
            for (let x = 0; x < this._xLen; x++) {
                msg_1 += '( ' + this._array[x][y] + ' )';
            }
            console.log(msg_1);
        }
    }

    /**
     * @param {any[][]} twoDimArr
     * @param {(v:any, x:number, y:number, arr:any[][])=>boolean} forEachCallback
     */
    static ForEach(twoDimArr, forEachCallback) {
        for (let x = 0; x < twoDimArr.length; x++) {
            for (let y = 0; y < twoDimArr[x].length; y++) {
                let ret = forEachCallback(twoDimArr[x][y], x, y, twoDimArr);
                if(!ret) { break; }
            }
        }
    }
}
