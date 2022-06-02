
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
import { CurveTestScene } from './t_CurveTestScene';
import { TestAnyScene } from './t_TestAnyScene';
import { TickTestScene } from './t_TickTestScene';
import { BlastScene } from './BlastScene';
import { ObjectMoveScene } from './t_ObjectMoveScene';
import { GameData, GameOption, GameStat } from './lib_common';


//=============================================================================================================================================================
// 전역(글로벌) 변수
//=============================================================================================================================================================

/** phaser.game 오브젝트 저장용
 * @type {Phaser.Game}
 */
export var game;



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
    {
        // @ts-ignore
        // eslint-disable-next-line no-undef
        if(argvStartSceneName) {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            console.log('FirstScene: ', argvStartSceneName);
            // @ts-ignore
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


