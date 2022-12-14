
// 도움말
// 페이져3 메인 : https://photonstorm.github.io/phaser3-docs/Phaser.html
// game : https://photonstorm.github.io/phaser3-docs/Phaser.Game.html
// game.scene : https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html
// https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html
// 카메라 : https://photonstorm.github.io/phaser3-docs/Phaser.Cameras.Scene2D.Camera.html#width__anchor
// 입력 : https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputManager.html (game.input)
// 입력 이벤트 : https://photonstorm.github.io/phaser3-docs/Phaser.Input.Events.html
// https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputPlugin.html (this.input)

import BlastScene from './BlastScene.js';
import CurveTestScene from './CurveTestScene.js';
import { XY, xy_2_str } from './gametype.js';
import { ResInfo } from "./res.js";
import TestAny from './TestAny.js';
import TickTest from './TickTest.js';

//=============================================================================================================================================================
// 전역(글로벌) 변수
//=============================================================================================================================================================

/** phaser.game 오브젝트 저장용 */
export var game;

/** 게임 옵션에 해당하는 파라미터를 모아 두는 곳 */
export var GameOption =
{
    ScreenWidth: 720, // 720
    ScreenHeight: 1280, // 1280,
    BkgndColor: '#111', // 0x08131a,
    LocalStorageName: "app_game_220506",
    DeltaTime: 0,
    DevMode: undefined,
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
};

/** 게임에서 쓰는 글로벌 데이터를 저장하기 위한 곳 */
export var GameData =
{
    /** GameStat의 인스턴스 */
    stat: undefined,
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

    game.scene.add('BlastScene', BlastScene);
    game.scene.add('CurveTestScene', CurveTestScene);
    game.scene.add('TestAny', TestAny);
    game.scene.add('TickTest', TickTest);

    let start_scene_name = 'BlastScene';
    //@ts-ignore
    if(argvStartSceneName) {
        //@ts-ignore
        start_scene_name = argvStartSceneName;
    }
    game.scene.start(start_scene_name);
    console.log("= preload_global(): done");
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
        type: Phaser.WEBGL,
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


