
// 도움말
// 페이져3 메인 : https://photonstorm.github.io/phaser3-docs/Phaser.html
// game : https://photonstorm.github.io/phaser3-docs/Phaser.Game.html
// game.scene : https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html
// https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html
// 카메라 : https://photonstorm.github.io/phaser3-docs/Phaser.Cameras.Scene2D.Camera.html#width__anchor
// 입력 : https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputManager.html (game.input)
// 입력 이벤트 : https://photonstorm.github.io/phaser3-docs/Phaser.Input.Events.html
// https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputPlugin.html (this.input)

import {XY, xy_2_str} from './gametype.js';

//=============================================================================================================================================================
// 전역(글로벌) 변수
//=============================================================================================================================================================

/** phaser.game 오브젝트 저장용 */
var game;

/** 게임 옵션에 해당하는 파라미터를 모아 두는 곳 */
var GameOption =
{
    ScreenWidth: 720, // 720
    ScreenHeight: 1280, // 1280,
    BkgndColor: '#eeeeee', // 0x08131a,
    LocalStorageName: "app_game_220506",
    DeltaTime: 0,
    DevMode: null,
};

/** 게임에서 쓰는 상수값을 모아 두는 곳 */
var GameConst =
{
    /** 트윈모션 시간, 기본 */
    TweenTime_Default: 180,
    /** 트윈모션 시간, 짧음 */
    TweenTime_Short: 100,
    TweenTime_OneSec: 1000,
    DefaultEasing: Phaser.Math.Easing.Back.Out,
};

/** 게임에서 쓰는 글로벌 데이터를 저장하기 위한 곳 */
var GameData =
{
    /** GameStat의 인스턴스 */
    stat: null,
};


/** 게임 내 애널리틱스 정보 저장용. 내부에 함수도 갖고 있어야 해서 클래스로 선언. */
var GameStat = function()
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

/** 게임의 실행 규칙을 저장해두는 곳. 옵션과는 좀 다르지.. */
var GameRule = {}

var GameRes =
{
    BoardViewSpec: {
        tileXLen:9, tileYLen:9,
        tilePixelWidth:70, tilePixelHeight:70
    },
    BasicSet: {
        // (Title) :{ key:'bg-001', filename:'assets/background.jpg', displayWidth:00, displayHeight:00 },
        bg:{ key:'bg-001', filename:'assets/background.jpg' },
        tile_bg:{ key:'tile-bg-001', filename:'assets/block_glow.png' },
        block_1: { key: 'block_blue', filename: 'assets/blue.png' },
        block_2: { key: 'block_green', filename: 'assets/green.png' },
        block_3: { key: 'block_orange', filename: 'assets/orange.png' },
        block_4: { key: 'block_red', filename: 'assets/red.png' },
        block_5: { key: 'block_violet', filename: 'assets/violet.png' },
        block_6: { key: 'block_yellow', filename: 'assets/yellow.png' },
    }
};

//=============================================================================================================================================================
// 메인 함수 - 코드의 시작점
//=============================================================================================================================================================

function preload_global()
{
    console.log("= preload_global(): start");

    // if (Phaser.Plugin.Debug != undefined) {
    //   game.plugins.add(Phaser.Plugin.Debug);
    // }
    // 디버그 UI 만들기
    // if (GameOption.USE_DBGUI) {
    //   if (typeof CDebugUI !== "undefined") {
    //     dbgui = new CDebugUI();
    //     dbgui.toggle_hide();
    //   }
    // }

    game.scene.add('main', GameMain);
    game.scene.start("main");
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

//=============================================================================================================================================================
// main() 고
//=============================================================================================================================================================

/** main */
main();

//=============================================================================================================================================================
// GameMain class - 리소스 로딩하고 끝. GameMain 으로 넘어감
//=============================================================================================================================================================

export default class GameMain extends Phaser.Scene
{
    static instance = undefined;

    constructor()
    {
        super('main');

        GameMain.instance = this; // todo: 현재 켜진 페이져 씬을 얻는 방법은?

        this.loading_pv = 0; // 로딩 시간을 저장하는 임시 변수. 이전 항목의 로딩 시간 저장용.
        this.img_bg = null;
        /** 테스트용 볼 이미지 */
        this.img_ball = null;
        //this.mov_assist = null;
        console.log("GameMain:constructor(): done");
    }


    preload()
    {
        GameData.stat.gtimeAppLoadingStart = this.time.now;
        console.log("GameMain:preload(): 初");
        console.log.apply(console,
            ["%c %c= GameMain.preload() load start: %c %d ms", 'color: #ffffff; background: #d44a52',
            'color: #fff; background: #000', 'color: #000; background: #ffffff',
            GameData.stat.gtimeAppLoadingStart]);

        // this.load.image('bg-001', 'assets/background.jpg');
        // this.load.image('tile-bg-001', 'assets/block_glow.png');

        let basic_set = GameRes.BasicSet;
        //console.log(basic_set);
        for(let key_str in basic_set)
        {
            console.log(key_str);
            let value = basic_set[key_str];
            //this.load.image('bg-001', 'assets/background.jpg');
            this.load.image(value.key, value.filename);
        }

        //this.load.image('tile-bg-001', 'assets/block_glow.png');

        console.log("GameMain:preload(): 終 ", this.time.now);
    }


    create()
    {
        {
            console.log("GameMain:create(): ", this.cameras.main.width, ", ", this.cameras.main.height);
            console.log("  this.cameras.main.width & height: ", this.cameras.main.width, ", ", this.cameras.main.height);
        }

        let _scrn_w = this.cameras.main.width;
        let _scrn_h = this.cameras.main.height;

        // 배경 이미지를 화면 크기만큼 늘린다.
        this.img_bg = this.add.image(_scrn_w/2, _scrn_h/2, 'bg-001');
        this.img_bg.setDisplaySize(_scrn_w, _scrn_h);

        this.img_tilebg = this.add.image(0, 0, 'tile-bg-001');

        // 스테이지 초기화
        this.stageView = new StageView();
        this.stageView.init();
    }

    update(time, delta)
    {
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class StageLogic
{
    constructor()
    {
        this.boardSize = new XY(GameRes.BoardViewSpec.xSize, GameRes.BoardViewSpec.ySize);
    }

    /** @param {number} dt delta-time */
    onUpdate(dt)
    {
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ATileView
{
    constructor()
    {
        this.tileImgKey = GameRes.BasicSet.bg.key;
        this.boardPos = undefined;
        this.screenPos = undefined;
        this.objBlock = undefined;
        this.jobTodo = undefined; // 이 타일에서 할일의 모음
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class StageView
{
    constructor()
    {
        this.stageLogic = undefined;
        this.boardPixelSize = undefined;
        this.boardXYLen = undefined;
        this.pivotPos = undefined;
        this.tilePixelSize = undefined;
        this.boardLeftTopWPos = undefined;
    }

    init()
    {
        this.initViewParams();
        this.initView();
        this.makeView();
    }

    initViewParams()
    {
        this.boardPixelSize = new XY();
        this.boardXYLen = new XY();
        this.pivotPos = new XY();
        this.boardLeftTopWPos = new XY();
        this.tilePixelSize = new XY();
    }

    initView()
    {
        this.pivotPos.x = GameOption.ScreenWidth / 2;
        this.pivotPos.y = GameOption.ScreenHeight / 2;

        this.boardXYLen.x = GameRes.BoardViewSpec.tileXLen;
        this.boardXYLen.y = GameRes.BoardViewSpec.tileYLen;

        this.tilePixelSize.x = GameRes.BoardViewSpec.tilePixelWidth;
        this.tilePixelSize.y = GameRes.BoardViewSpec.tilePixelHeight;

        this.boardPixelSize.x = GameRes.BoardViewSpec.tilePixelWidth * this.boardXYLen.x;
        this.boardPixelSize.y = GameRes.BoardViewSpec.tilePixelHeight * this.boardXYLen.y;

        let tile_pixel_halfsize = new XY(this.boardPixelSize.x / 2, this.boardPixelSize.y / 2);

        console.log('this.pivotPos > ', this.pivotPos);
        console.log('this.boardXYLen > ', this.boardXYLen);
        console.log('this.boardPixelSize > ', this.boardPixelSize);
        console.log('tile_pixel_halfsize > ', tile_pixel_halfsize);

        this.boardLeftTopWPos.x = this.pivotPos.x - tile_pixel_halfsize.x;
        this.boardLeftTopWPos.y = this.pivotPos.y - tile_pixel_halfsize.y;

        console.log('this.boardLeftTopWPos > ', this.boardLeftTopWPos);
    }

    makeView()
    {
        //GameMain.instance.add.image(this.boardLeftTopWPos.x, this.boardLeftTopWPos.y, 'tile-bg-001');

        let xpos = this.boardLeftTopWPos.x;
        for(let xi = 0; xi < this.boardXYLen.x; xi++)
        {
            let ypos = this.boardLeftTopWPos.y;
            for(let yi = 0; yi < this.boardXYLen.y; yi++)
            {
                //GameMain.instance.add.image(xpos, ypos, 'tile-bg-001');
                //console.log(xy_2_str(xpos, ypos));
                ypos += this.tilePixelSize.y;
            }
            xpos += this.tilePixelSize.x;
        }
    }
}