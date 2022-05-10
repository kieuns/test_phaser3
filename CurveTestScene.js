import { XY } from "./gametype.js";
import { GameData, GameOption } from "./main.js";
import { ResInfo } from "./res.js";

// graphics : https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Graphics.html

export default class CurveTestScene extends Phaser.Scene
{
    static instance = undefined;

    constructor()
    {
        super('curve_test_scene');
        CurveTestScene.instance = this;
        this.graphics = undefined;
        this.lineDataArr = undefined;
        this.lineObjIndex = 0;
        this.lineObjArr = undefined;
        console.log(this.constructor.name, "constructor(): done");
    }

    preload()
    {
    }

    create()
    {
        this.graphics = this.add.graphics(); // this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

        this.lineDataArr = [ {x:0, y:0}, {x:100, y:200} ];
        this.lineObjArr = [];
    }

    getLine()
    {
        if(this.lineObjIndex >= this.lineObjArr.length) {
            this.lineObjArr.push(new Phaser.Geom.Line(0, 0, 100, 200));
        }
        let a_line = this.lineObjArr[this.lineObjIndex];
        this.lineObjIndex++;
        return a_line;
    }

    /**
     * @param {number} time current time
     * @param {number} delta delta time
     */
    update(time, delta)
    {
        //console.log('update > ', time, ',', delta);
        this.graphics.clear();

        this.lineObjIndex = 0;
        for(let i = 0; i < this.lineDataArr.length; i+=2)
        {
            let line = this.getLine();
            line.x1 = this.lineDataArr[i].x;
            line.y1 = this.lineDataArr[i].y;
            line.x2 = this.lineDataArr[i+1].x;
            line.y2 = this.lineDataArr[i+1].y;

            this.graphics.lineStyle(1, 0xffffff, 1);
            this.graphics.strokeLineShape(line);
        }
    }
};
