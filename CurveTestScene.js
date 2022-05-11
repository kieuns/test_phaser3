import { XY } from "./gametype.js";
import { GameData, GameOption } from "./main.js";
import { ResInfo } from "./res.js";

// class doc
// - graphics : https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Graphics.html
// example
// - geom : http://phaser.io/examples/v3/category/geom

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

        this.dotDataArr = undefined;
        this.dotObjIndex = 0;
        this.dotObjArr = undefined;
    }

    preload()
    {
    }

    create()
    {
        this.graphics = this.add.graphics(); // this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

        this.lineDataArr = [
            { line:{color:0xffffff}, from:{x:0, y:0}, to:{x:100, y:200 } },
            { line:{color:0xff0000}, from:{x:200, y:50}, to:{x:200, y:400} }
        ];
        this.lineObjArr = [];

        this.dotDataArr = [
            { line:{color:0xff00ff}, to:{x:100, y:200 } },
        ];
        this.dotObjArr = [];
    }

    getLine()
    {
        if(this.lineObjIndex >= this.lineObjArr.length) {
            this.lineObjArr.push(new Phaser.Geom.Line(0, 0, 0, 0));
        }
        let a_line = this.lineObjArr[this.lineObjIndex];
        this.lineObjIndex++;
        return a_line;
    }

    getDot()
    {
        if(this.dotObjIndex >= this.dotObjArr.length) {
            this.dotObjArr.push(new Phaser.Geom.Point(0, 0));
        }
        let obj = this.dotObjArr[this.dotObjIndex];
        this.dotObjIndex++;
        return obj;
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
        this.dotObjIndex = 0;
        for(let i = 0; i < this.lineDataArr.length; i++)
        {
            let line = this.getLine();
            line.x1 = this.lineDataArr[i].from.x;
            line.y1 = this.lineDataArr[i].from.y;
            line.x2 = this.lineDataArr[i].to.x;
            line.y2 = this.lineDataArr[i].to.y;

            this.graphics.lineStyle(1, this.lineDataArr[i].line.color, 1);
            this.graphics.strokeLineShape(line);
        }

        for(let i = 0; i < this.dotDataArr.length; i++)
        {
            let dot = this.getDot();
            dot.x = this.dotDataArr[i].to.x;
            dot.y = this.dotDataArr[i].to.y;

            this.graphics.fillPointShape(dot, 20);
        }
    }
};
