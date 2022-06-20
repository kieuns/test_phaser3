
// 도움말
// 페이져3 메인 : https://photonstorm.github.io/phaser3-docs/Phaser.html
// game : https://photonstorm.github.io/phaser3-docs/Phaser.Game.html
// game.scene : https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html
// https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html
// 카메라 : https://photonstorm.github.io/phaser3-docs/Phaser.Cameras.Scene2D.Camera.html#width__anchor
// 입력 : https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputManager.html (game.input)
// 입력 이벤트 : https://photonstorm.github.io/phaser3-docs/Phaser.Input.Events.html
// https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputPlugin.html (this.input)

import Phaser from 'phaser'
import { ATempl } from './a_templ';


//=============================================================================================================================================================
// 전역(글로벌) 변수
//=============================================================================================================================================================

/** phaser.game 오브젝트 저장용 */
export let game;

/** 게임 옵션에 해당하는 파라미터를 모아 두는 곳 */
export let GameOption =
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
export let GameConst =
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
export class GameData
{
    /** GameStat의 인스턴스 */
    public static stat:GameStat = null;
};


/** 게임 내 애널리틱스 정보 저장용. 내부에 함수도 갖고 있어야 해서 클래스로 선언. */
export class GameStat
{
    // -- 세션동안 유지할것 --
    // 시간 값은 game.time.now를 사용하기 때문에 일반 시간이 아니라 0부터 시작하는 ms 시간 인 경우가 있는데,
    // 값을 어디에 맞춰 쓸지 다시 생각해보고 재설정 해야 함.

    /** 앱이 시작된 시간.Date.now() 로 얻은 시간값. */
    public timeAppStarted:number = 0;

    /** 앱이 시작된 시간. ms 값. game.time.now 로 얻은 시간값. */
    public gtimeAppStarted:number = 0;
    /** 앱 로딩 시작 시간 ms 값 */
    public gtimeAppLoadingStart:number = 0;
    /** 앱 로딩이 끝난 시간. ms 값. */
    public gtimeAppLoadingEnd:number = 0;
};


//=============================================================================================================================================================
// 메인 함수 - 코드의 시작점
//=============================================================================================================================================================

function preload_global()
{
    console.log("= preload_global(): start");

    // if(Phaser.Plugin.Debug != undefined) {
    //     game.plugins.add(Phaser.Plugin.Debug);
    // }
    // 디버그 UI 만들기
    // if (GameOption.USE_DBGUI) {
    //   if (typeof CDebugUI !== "undefined") {
    //     dbgui = new CDebugUI();
    //     dbgui.toggle_hide();
    //   }
    // }

    game.scene.add('a_templ', ATempl);

    let start_scene_name = 'a_templ';
    {
        //@ts-ignore
        // eslint-disable-next-line no-undef
        if(argvStartSceneName) {
            //@ts-ignore
            // eslint-disable-next-line no-undef
            console.log('FirstScene: ', argvStartSceneName);
            //@ts-ignore
            // eslint-disable-next-line no-undef
            start_scene_name = argvStartSceneName;
        }
        else {
            console.log('FirstScene: No Scene info: ');
        }
    }
    let the_scene = game.scene.getScene(start_scene_name);
    if(the_scene === null) {
        console.log('Scene.Start.Failed: ', start_scene_name);
    }
    else {
        game.scene.start(start_scene_name);
    }
    console.log("= preload_global(): exit");
}

function main()
{
    GameData.stat = new GameStat();
    GameData.stat.timeAppStarted = Date.now();
    GameData.stat.gtimeAppStarted = performance.now();

    // event는 설정하지 않고 state를 사용합니다.
    var config =
    {
        width: GameOption.ScreenWidth,
        height: GameOption.ScreenHeight,
        type: Phaser.AUTO,
        backgroundColor: GameOption.BkgndColor,
        scale: {
            autoCenter: Phaser.Scale.CENTER_BOTH,
            mode: Phaser.Scale.FIT
        },
        parent: 'game_main',
        scene:
        {
            preload: preload_global
        },
        //transparent: true,
    };
    game = new Phaser.Game(config);
    console.log("main(): done. next move is preload()");
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** main */
main();


