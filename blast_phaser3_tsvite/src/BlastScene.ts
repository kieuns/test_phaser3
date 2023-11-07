/* eslint-disable no-unused-vars */

import dat from 'dat.gui';
import Phaser from 'phaser'
import { XY } from './lib_gametype';
import { ResInfo } from './lib_res';
import { GameData, GameOption } from './main';
import { TickPlay } from './TickPlay';


//=============================================================================================================================================================
// BlastScene class - 리소스 로딩하고 끝. BlastScene 으로 넘어감
//=============================================================================================================================================================

export class BlastScene extends Phaser.Scene
{
    static inst:BlastScene = undefined;

    /** @type {number} */
    loading_pv:number = 0; // 로딩 시간을 저장하는 임시 변수. 이전 항목의 로딩 시간 저장용.

    /** @type {Phaser.GameObjects.Image} */
    img_bg:Phaser.GameObjects.Image = null;

    /** @type {Phaser.GameObjects.Image} */
    img_ball:Phaser.GameObjects.Image = null; // 테스트용 볼 이미지

    /** @type {StageLogic} */
    stageLogic:StageLogic = null;

    constructor()
    {
        super('BlastScene');
        BlastScene.inst = this;
        console.log(this.constructor.name, "constructor(): done");
    }

    preload()
    {
        GameData.stat.gtimeAppLoadingStart = this.time.now;
        console.log(this.constructor.name, '初');
        console.log.apply(console,
            ["%c %c= BlastScene.preload() load start: %c %d ms", 'color: #ffffff; background: #d44a52',
            'color: #fff; background: #000', 'color: #000; background: #ffffff',
            GameData.stat.gtimeAppLoadingStart]);

        // Object.keys(ResInfo.BasicSet).forEach(key => {
        //     let value = ResInfo.BasicSet[key]; //
        //     this.load.image(value.key, value.filename);
        //     console.log('img-load: ', value.key, ' : ', value.filename);
        // });
        console.log("BlastScene:preload(): 終 ", this.time.now);
    }

    create()
    {
        console.log("BlastScene:create(): ", this.cameras.main.width, ", ", this.cameras.main.height);
        console.log("  this.cameras.main.width & height: ", this.cameras.main.width, ", ", this.cameras.main.height);

        dgui.init();

        let _scrn_w = this.cameras.main.width;
        let _scrn_h = this.cameras.main.height;

        // 배경 이미지를 화면 크기만큼 늘린다.
        this.img_bg = this.add.image(_scrn_w/2, _scrn_h/2, ResInfo.BasicSet.bg.key);
        this.img_bg.setDisplaySize(_scrn_w, _scrn_h);

        // todo: delme
        //this.img_tilebg = this.add.image(ResInfo.Param.default_x, ResInfo.Param.default_y, ResInfo.BasicSet.tile_bg.key);

        // 로직 클래스 준비
        //
        this.stageLogic = new StageLogic();

        // // 스테이지 초기화
        // this.stageView = new StageView();
        // this.stageView.init();

        //this.stageLogic.start();
    }

    /**
     * @param {number} [time] - unit ms
     * @param {number} [delta] - unit ms
     */
    update(time:number, delta:number) { }
}

//=====================================================================================================================

class StageLogic
{
    /** @type {TickPlay} */
    tickPlay:TickPlay = null;
    boardSize:XY;

    constructor()
    {
        this.boardSize = new XY(ResInfo.BoardViewSpec.tileXLen, ResInfo.BoardViewSpec.tileYLen);
        this.tickPlay = new TickPlay(30);
        this.tickPlay.setUpdateCallback(this.onUpdateByTick.bind(this));
    }

    start()
    {
        this.tickPlay.start();
    }

    /** @param {number} [tick] */
    onUpdateByTick(tick:number)
    {
        //console.log('StageLogic:updateTick: ', tick);
    }
}

//=====================================================================================================================

class JobTodo {
    /** 이 타일에서 할일 모아둔 것
     * { (() => void)[] }
     * @type {Array<(() => void)>}
     */
    protected jobTodo:(()=>void)[]; // 이 타일에서 할일의 모음

    /** @param {(() => void)} [func] */
    reserveJob(func:()=>void)
    {
        this.jobTodo.push(func);
    }
};

/** @class
 * 블럭의 기본 클래스
 */
class ABlockLogicBase
{
    bpos = new XY(0,0);
    wpos = new Phaser.Math.Vector2(0,0);
}
Object.assign(ABlockLogicBase.prototype, JobTodo);

class ABlockDraw
{
    /** @type {Phaser.GameObjects.Image} */
    image:Phaser.GameObjects.Image = null;

    /** @param {string} imageKey */
    create(imageKey:string)
    {
        this.image = BlastScene.inst.add.image(ResInfo.Param.default_x, ResInfo.Param.default_y, imageKey);
    }
}
Object.assign(ABlockDraw.prototype, JobTodo);

//=====================================================================================================================

class ATileLogic
{
}
Object.assign(ATileLogic.prototype, JobTodo);

/**
 * TileView 변수 형태로 저장
 * @class
 */
class ATileView extends Phaser.GameObjects.Image
{
    /** @type {string} */
    tileImgKey = ResInfo.BasicSet.tile_bg.key;
    /** @type {Phaser.GameObjects.Image} 타일 기본 이미지 */
    image:Phaser.GameObjects.Image = null;
    /** @type {XY} */
    boardPos:XY = null;
    /** @type {Phaser.Math.Vector2} */
    screenPos:Phaser.Math.Vector2 = null;
    /** 현재 타일에 있는 블럭 */
    block = null;
    constructor(scene:Phaser.Scene)
    {
        super(scene, 0, 0);
        Phaser.GameObjects.Image.call(this, scene, 0, 0, this.tileImgKey);
        this.setAlpha(0.1, 0,5, 0.5, 0.1);
    }
}

//=====================================================================================================================

class StageView
{
    /** @type {StageLogic} */
    stageLogi:StageLogic = undefined;
    /** @type {XY} */
    boardPixelSize:XY = undefined;
    /** @type {XY} */
    boardXYLen:XY = undefined;
    /** @type {XY} */
    pivotPos:XY = undefined;
    /** @type {XY} */
    tilePixelSize:XY = undefined;
    /** @type {XY} */
    boardLeftTopWPos:XY = undefined;
    /** @type {Array<ATileView>} */
    tileviewArr:Array<ATileView> = undefined;
    /** @type {Phaser.GameObjects.Group} */
    tileviewGroup:Phaser.GameObjects.Group = undefined;
    /** @type {Array<ABlockDraw>} */
    blockdrawArr:Array<ABlockDraw> = null;

    constructor()
    {
    }

    init()
    {
        this.allocOnMembers();
        this.calcViewSize();
        this.makeView();

        this.makeBlock();
    }

    allocOnMembers()
    {
        this.boardPixelSize = new XY();
        this.boardXYLen = new XY();
        this.pivotPos = new XY();
        this.boardLeftTopWPos = new XY();
        this.tilePixelSize = new XY();

        this.tileviewArr = [];
        this.tileviewGroup = BlastScene.inst.add.group({classType: ATileView, maxSize:81});
        this.blockdrawArr = [];
    }

    calcViewSize()
    {
        this.pivotPos.x = GameOption.ScreenWidth / 2;
        this.pivotPos.y = GameOption.ScreenHeight / 2;

        this.boardXYLen.x = ResInfo.BoardViewSpec.tileXLen;
        this.boardXYLen.y = ResInfo.BoardViewSpec.tileYLen;

        this.tilePixelSize.x = ResInfo.BoardViewSpec.tilePixelWidth;
        this.tilePixelSize.y = ResInfo.BoardViewSpec.tilePixelHeight;

        this.boardPixelSize.x = ResInfo.BoardViewSpec.tilePixelWidth * this.boardXYLen.x;
        this.boardPixelSize.y = ResInfo.BoardViewSpec.tilePixelHeight * this.boardXYLen.y;

        let tile_pixel_halfsize = new XY(this.boardPixelSize.x / 2, this.boardPixelSize.y / 2);

        console.log('this.pivotPos > ', this.pivotPos);
        console.log('this.boardXYLen > ', this.boardXYLen);
        console.log('this.boardPixelSize > ', this.boardPixelSize);
        console.log('tile_pixel_halfsize > ', tile_pixel_halfsize);

        this.boardLeftTopWPos.x = this.pivotPos.x - tile_pixel_halfsize.x + (this.tilePixelSize.x/2);
        this.boardLeftTopWPos.y = this.pivotPos.y - tile_pixel_halfsize.y + (this.tilePixelSize.y/2);

        console.log('this.boardLeftTopWPos > ', this.boardLeftTopWPos);
    }

    makeView()
    {
        //BlastScene.instance.add.image(this.boardLeftTopWPos.x, this.boardLeftTopWPos.y, 'tile-bg-001');

        let ypos = this.boardLeftTopWPos.y;
        for(let yi = 0; yi < this.boardXYLen.y; yi++)
        {
            let xpos = this.boardLeftTopWPos.x;
            for(let xi = 0; xi < this.boardXYLen.x; xi++)
            {
                let new_tile_img = this.tileviewGroup.get(xpos, ypos);
                if(new_tile_img)
                {
                    new_tile_img.x = xpos;
                    new_tile_img.y = ypos;
                    this.tileviewArr.push(new_tile_img);
                    //BlastScene.instance.add.image(xpos, ypos, 'tile-bg-001');
                    //console.log(xy_2_str(xpos, ypos));
                }
                else {
                    console.warn('no new tile');
                }
                xpos += this.tilePixelSize.x;
            }
            ypos += this.tilePixelSize.y;
        }
    }

    makeBlock()
    {
        let a = new ABlockDraw();
        a.create(ResInfo.BasicSet.block_1.key);
    }
}

//=====================================================================================================================

class dgui
{
    /** @type {dgui} */
    static instance:dgui = null;
    static init() {
        dgui.instance = new dgui();
        dgui.instance.install();
    }

    /** @type {dat.GUI} */
    _datGui:dat.GUI = null;

    /** dat.GUI 를 특정 돔에 설치한다. */
    install()
    {
        this._datGui = new dat.GUI();
        const target_dom = document.getElementById('datgui');
        if (target_dom)
        {
            this._datGui.domElement.style.setProperty('position', 'absolute');
            this._datGui.domElement.style.setProperty('top', '0px');
            this._datGui.domElement.style.setProperty('left', '0px');
            target_dom?.appendChild(this._datGui.domElement);
        }
        this.buidMenu();
    }

    // .listen() : 값의 변화를 계속 감시
    // .onChange( (v) => {} ) : 값이 변할때 호출

    /** 메뉴 빌드 */
    buidMenu()
    {
        let root_folder = this._datGui;
        let opt1_folder = this._datGui.addFolder('[옵션1]');
    }
}
