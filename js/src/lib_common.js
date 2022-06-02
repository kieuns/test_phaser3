
import Phaser from 'phaser';

/** 게임 옵션에 해당하는 파라미터를 모아 두는 곳 */
export var GameOption =
{
    ScreenWidth: 720, // 720
    ScreenHeight: 1280, // 1280,
    BkgndColor: '#111', // 0x08131a,
    LocalStorageName: "app_game_220506",
    DeltaTime: 0,
    DevMode: undefined,
    __end__:-1
};

/** 게임에서 쓰는 상수값을 모아 두는 곳 */
export var GameConst =
{
    /** 트윈모션 시간, 기본 */
    TweenTime_Default: 180,
    /** 트윈모션 시간, 짧음 */
    TweenTime_Short: 100,
    TweenTime_OneSec: 1000,
    DefaultEasing: Phaser.Math.Easing.Back.Out,
    __end__:-1
};

/** 게임에서 쓰는 글로벌 데이터를 저장하기 위한 곳 */
export var GameData =
{
    /** GameStat의 인스턴스 */
    stat: undefined,
    __end__:-1
};


/** 게임 내 애널리틱스 정보 저장용. 내부에 함수도 갖고 있어야 해서 클래스로 선언. */
export var GameStat = function()
{
    // -- 세션동안 유지할것 --
    // 시간 값은 game.time.now를 사용하기 때문에 일반 시간이 아니라 0부터 시작하는 ms 시간 인 경우가 있는데,
    // 값을 어디에 맞춰 쓸지 다시 생각해보고 재설정 해야 함.

    /** 앱이 시작된 시간.Date.now() 로 얻은 시간값. */
    this.timeAppStarted = 0;

    /** 앱이 시작된 시간. ms 값. game.time.now 로 얻은 시간값. */
    this.gtimeAppStarted = 0;
    /** 앱 로딩 시작 시간 ms 값 */
    this.gtimeAppLoadingStart = 0;
    /** 앱 로딩이 끝난 시간. ms 값. */
    this.gtimeAppLoadingEnd = 0;

    GameStat.prototype = {
        sample_func() {}
    }
};
