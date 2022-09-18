// @ts-nocheck
import { log } from "./log";

/**
 * 틱에 작업을 넣고 때가 되면 실행 되게 하는 작업 스케쥴러.
 * @example
 * let tickPlay = new TickPlay();
 * tickPlay.start(); // 스케쥴러 시작
 * tickPlay.reserveOnTime(0.1, () => { // 0.1초 뒤에 실행
 *   console.log('workdone: ', tickPlay.getNowTick());
 * });
 */
export class TickPlay
{
    /** @type {number} */
    _tickNowIndex = 0;

    /** @type {number} */
    _tickPerSec = 10;

    /** @type {number} 루프가 끝난 시점의 _tickNowIndex */
    _tickCleared = -1;

    /** @type {number} 루프를 끝나는 시간 */
    _expectEndTime = -1;

    /** @type {number} 루프를 끝낼 틱 */
    _expectEndTick = -1;

    /** @type {number} setInterval() 리턴값 */
    _tickTimerId = null;

    /** @type {boolean} 루프 시작 되었나? */
    _loopStarted = false;

    /**
     * _workTodo: { time:number, func:()=>{} }[];
     * @type {array} 작업 목록을 들고 있을 배열
     */
    _workTodo = null;

    /** @type {((tick) => {})} */
    _onUpdate = null;

    getNowTick() { return this._tickNowIndex; }

    getNowAsTime() { return this._tickNowIndex * this._tickPerSec; }

    /** @param {((tick) => {})} [func] */
    setUpdateCallback(func) { this._onUpdate = func; }

    constructor(tickPerSec = 15)
    {
        this._tickPerSec = tickPerSec;
    }

    /**
     * @param {number} [expectEndTick] (unit:tick)
     * @param {boolean} [isTime=false]
     */
    start(expectEndTick, isTime = false)
    {
        expectEndTick = (expectEndTick ? expectEndTick : (12*60));
        if(isTime) {
            this._expectEndTick = (expectEndTick / (1000/this._tickPerSec));
            this._expectEndTime = expectEndTick;
        }
        else {
            this._expectEndTick = expectEndTick;
            this._expectEndTime = this._tickPerSec * expectEndTick;
        }
        this._tickNowIndex = 0;
        this._workTodo = [];
        this._tickTimerId = setInterval( this.onTick.bind(this), 1000 / this._tickPerSec );
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

        this._onUpdate && this._onUpdate(this._tickNowIndex);
    }

    /**
     * @param {number} [tick] - 예약 타이밍. 틱 기반.
     * @param {function} [callback] - 호출 함수
     */
    reserveOnTick(tick, callback)
    {
        if(!this._loopStarted) { console.warn('TickPlay : not started'); return; }
        // prev > Math.floor(tick * this._tickPerSec);
        let nx_tick = tick;
        this._workTodo.push({ tick:nx_tick, func:callback, delete:false });
    }

    /**
     * @param {number} [tickFuture] - 예약 타이밍. 틱 기반.
     * @param {function} [callback] - 호출 함수
     */
    reserveOnNextTick(tickFuture, callback)
    {
        this.reserveOnTick(this._tickNowIndex + tickFuture, callback);
    }

    /**
     * @param {number} time - 예약 시간, 지금에서 얼마 뒤. ms
     * @param {function} callback - 호출 함수
     * @param {number} [repeatCnt=1]
     * @param {number} [repeatTimeDur]
     */
    reserveOnTime(time, callback, repeatCnt = 1, repeatTimeDur)
    {
        if(!this._loopStarted) { console.warn('TickPlay : not started'); return; }

        let repeat_time = repeatTimeDur ? repeatTimeDur : time;

        for(let i = 0; i < repeatCnt; i++)
        {
            let nx_tick = this._tickNowIndex + Math.ceil(time*this._tickPerSec);

            if(log.detail) { console.log('tickplay : now: ', this._tickNowIndex, ' expect at : ', nx_tick, ', time:', time.toFixed(4)); }

            this._workTodo.push({tick: nx_tick, func:callback, delete:false});

            time += repeat_time;
        }
    }
}
