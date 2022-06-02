/* eslint-disable no-unused-vars */

import Phaser from 'phaser';
import { GameData, GameOption } from './lib_common';
import { XY } from "./lib_gametype";
import { ResInfo } from "./lib_res";

//=====================================================================================================================

export class BlastScene extends Phaser.Scene
{
    static instance = undefined;

    constructor()
    {
        super('BlastScene');

        BlastScene.instance = this;

        this.loading_pv = 0; // 로딩 시간을 저장하는 임시 변수. 이전 항목의 로딩 시간 저장용.
        this.img_bg = null;
        this.img_ball = null; // 테스트용 볼 이미지

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

        for(let key_str in ResInfo.BasicSet)
        {
            let value = ResInfo.BasicSet[key_str];
            this.load.image(value.key, value.filename);
            //console.log('img-load: ', value.key, ' : ', value.filename);
        }

        console.log("BlastScene:preload(): 終 ", this.time.now);
    }

    create()
    {
        console.log("BlastScene:create(): ", this.cameras.main.width, ", ", this.cameras.main.height);
        console.log("  this.cameras.main.width & height: ", this.cameras.main.width, ", ", this.cameras.main.height);

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

    /**
     * @param {number} [time] - unit ms
     * @param {number} [delta] - unit ms
     */
    update(time, delta)
    {
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class StageLogic
{
    constructor()
    {
        this.boardSize = new XY(ResInfo.BoardViewSpec.tileXLen, ResInfo.BoardViewSpec.tileYLen);
    }

    /** @param {number} dt delta-time */
    onUpdate(dt)
    {
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * TileView 변수 형태로 저장
 * @class
 */
class ATileView
{
    /** @type {string} */
    tileImgKey = null;

    /** @type {Phaser.GameObjects.Image} 타일 기본 이미지 */
    image = null;

    /** @type {XY} */
    boardPos = null;

    /** @type {Phaser.Math.Vector2} */
    screenPos = null;

    objBlock = null;

    /** 이 타일에서 할일 모아둔 것
     * { (() => void)[] }
     * @type {Array<(() => void)>}
     */
    jobTodo = null; // 이 타일에서 할일의 모음

    constructor()
    {
        this.tileImgKey = ResInfo.BasicSet.tile_bg.key;
        this.jobTodo = [];
        //Phaser.GameObjects.Image.call(this, scene, 0, 0, this.tileImgKey);
        //this.setAlpha(0.1, 0,5, 0.5, 0.1);
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

        this.tileImgArr = undefined;
        this.tileImgGroup = undefined;
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

        this.tileImgArr = [];
        //this.tileImgGroup = BlastScene.instance.add.group({defaultKey: 'tile-bg-001', maxSize:81});
        //this.tileImgGroup = BlastScene.instance.add.group({classType: ATileView, maxSize:81});
    }

    initView()
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
                // let new_tile_img = this.tileImgGroup.get(xpos, ypos);
                // if(new_tile_img)
                // {
                //     new_tile_img.x = xpos;
                //     new_tile_img.y = ypos;
                //     this.tileImgArr.push(new_tile_img);
                //     //BlastScene.instance.add.image(xpos, ypos, 'tile-bg-001');
                //     //console.log(xy_2_str(xpos, ypos));
                // }
                // else {
                //     console.warn('no new tile');
                // }
                xpos += this.tilePixelSize.x;
            }
            ypos += this.tilePixelSize.y;
        }
    }
}