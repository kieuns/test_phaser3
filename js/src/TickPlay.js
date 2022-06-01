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

    /** @type {number} 게임이 끝나는 틱 */
    _tickCleared = -1;

    /** @type {number} 게임이 끝나는 시간 */
    _expectEndTime = 0;

    /** @type {number} setInterval() 리턴값 */
    _tickTimerId = null;

    /** @type {boolean} 루프 시작 되었나? */
    _loopStarted = false;

    /**
     * _workTodo: { time:number, func:()=>{} }[];
     * @type {array} 작업 목록을 들고 있을 배열
     */
    _workTodo = null;


    getNowTick() { return this._tickNowIndex; }

    getNowAsTime() { return this._tickNowIndex * this._tickPerSec; }


    /** @param {number} expectEndTime unit:sec */
    start(expectEndTime)
    {
        this._expectEndTime = this._tickPerSec * (expectEndTime ? expectEndTime : (12*60));
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
    }

    /**
     * @param {number} tick - 예약 타이밍. 틱 기반.
     * @param {function} callback - 호출 함수
     */
    reserveOnTick(tick, callback)
    {
        if(!this._loopStarted) { console.warn('TickPlay : not started'); return; }
        let nx_tick = Math.floor(tick * this._tickPerSec);
        this._workTodo.push({ tick:nx_tick, func:callback, delete:false });
    }

    /**
     * @param {number} time - 예약 시간, 지금에서 얼마 뒤. ms
     * @param {function} callback - 호출 함수
     * @param {number} repeatCnt
     */
    reserveOnTime(time, callback, repeatCnt = 1)
    {
        if(!this._loopStarted) {
            console.warn('TickPlay : not started');
            return;
        }

        let repeat_time = time;

        for(let i = 0; i < repeatCnt; i++)
        {
            let nx_tick = this._tickNowIndex + Math.ceil(time*this._tickPerSec);

            if(log.detail) { console.log('tickplay : now: ', this._tickNowIndex, ' expect at : ', nx_tick, ', time:', time.toFixed(4)); }

            this._workTodo.push({tick: nx_tick, func:callback, delete:false});

            time += repeat_time;
        }
    }
}
