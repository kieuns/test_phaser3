
export class LogUtil {
    LogLevel:number;
    get few(): boolean;
    get basic(): boolean;
    get detail(): boolean;
    get verydetail(): boolean;
    get toomuch(): boolean;
}
export var log: LogUtil;
