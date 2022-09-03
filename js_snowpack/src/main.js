/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// 도움말
// 페이져3 메인 : https://photonstorm.github.io/phaser3-docs/Phaser.html
// game : https://photonstorm.github.io/phaser3-docs/Phaser.Game.html
// game.scene : https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html
// https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html
// 카메라 : https://photonstorm.github.io/phaser3-docs/Phaser.Cameras.Scene2D.Camera.html#width__anchor
// 입력 : https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputManager.html (game.input)
// 입력 이벤트 : https://photonstorm.github.io/phaser3-docs/Phaser.Input.Events.html
// https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputPlugin.html (this.input)

import Phaser from 'phaser';
import { CurveTestScene } from './CurveTestScene';
import { TestAnyScene } from './TestAnyScene';
import { TickTestScene } from './TickTestScene';
import { BlastScene } from './BlastScene';
import { ObjectMoveScene } from './ObjectMoveScene';
import { GameData, GameOption, GameStat } from './lib_common';


//=============================================================================================================================================================
// 전역(글로벌) 변수
//=============================================================================================================================================================

/** phaser.game 오브젝트 저장용
 * @type {Phaser.Game}
 */
export let game = null;



//=============================================================================================================================================================
// 메인 함수 - 코드의 시작점
//=============================================================================================================================================================

//var argvStartSceneName;

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
    game.scene.add('TestAny', TestAnyScene);
    game.scene.add('TickTest', TickTestScene);
    game.scene.add('ObjectMove', ObjectMoveScene);

    let start_scene_name = 'BlastScene';
    if(StartScene) {
        console.log('FirstScene: ', StartScene);
        start_scene_name = StartScene;
    }
    else {
        console.log('FirstScene: No Scene info: ');
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

/** new Phaser.Game()에 사용할 페이저 초기화 파라미터 만들기 */
export function makeBasicPhaserConfig()
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
        //dom: { createContainer: true }, // 페이져에서 돔 엘리먼트 사용하게 하기
        parent: 'game_main',
        scene: {
            preload: preload_global
        },
    };
    return config;
}

/** @returns {Phaser.Game} new_game */
function makePhaser(config)
{
    let new_game = new Phaser.Game(config);
    console.log("Phaser.Game() make done. begin default scene");
    return new_game;
}

function start_default_main()
{
    let config = makeBasicPhaserConfig();
    game = makePhaser(config);
}

/** CurveScene를 위한 초기화 함수 */
function start_curve_scene()
{
    function preloadForCurveScene()
    {
        console.log("= preloadForCurveScene(): start");
        let start_scene_name = 'CurveTestScene';
        game.scene.add(start_scene_name, CurveTestScene);
        let the_scene = game.scene.getScene(start_scene_name);
        if(the_scene === null) {
            console.warn('Scene.Start.Failed: ', start_scene_name);
        }
        else {
            game.scene.start(start_scene_name);
        }
        console.log("= preloadForCurveScene(): exit");
    }

    let config = makeBasicPhaserConfig();
    config.dom = { createContainer: true }; // 페이져에서 돔 엘리먼트 사용하게 하기
    config.scene.preload = preloadForCurveScene;
    game = makePhaser(config);
}

if(StartScene === 'CurveTestScene') {
    start_curve_scene();
}
else {
    start_default_main();
}

