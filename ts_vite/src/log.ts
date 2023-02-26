

/** 로그에 대한 기능을 모아두는 */
export class LogUtil
{
    private LogLevel = 5;

    get few() { return this.LogLevel > 0; }        // 1
    get basic() { return this.LogLevel > 1; }      // 2
    get detail() { return this.LogLevel > 2; }     // 3
    get verydetail() { return this.LogLevel > 4; } // 5
    get toomuch() { return this.LogLevel > 5; }    // 6
}

export var log = new LogUtil();
