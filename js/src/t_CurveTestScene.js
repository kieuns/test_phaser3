// @ts-nocheck
/* eslint-disable no-unused-vars */
import Phaser from 'phaser'
import { TickPlay } from './TickPlay';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// class doc
// - graphics : https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Graphics.html
// example
// - geom : http://phaser.io/examples/v3/category/geom

// https://phaser.io/examples/v3/view/game-objects/graphics/obj-scene

// 입력
// - InputManager : https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputPlugin.html
// - setInteractive : https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObject.html#setInteractive__anchor
// example
// - https://phaser.io/examples/v3/view/game-objects/dom-element/input-test
// - https://phaser.io/examples/v3/category/input
// - game-objects/dom-element/InputTest
// - https://phaser.io/examples/v3/search?search=input

/*
// ex1
graphics.lineStyle(5,0xFF00FF,1.0);
graphics.beginPath();
graphics.moveTo(100,100);
graphics.lineTo(200,200);
graphics.closePath();
graphics.strokePath();
// ex2
graphics.lineStyle(5,0xFF00FF, 1.0);
graphics.fillStyle(0xFFFFFF, 1.0);
graphics.fillRect(50, 50, 400, 200);
graphics.strokeRect(50, 50, 400, 200);

// 입력처리
var sprite = this.add.sprite(x, y, texture);
sprite.setInteractive();
sprite.on('pointerdown', callback, context);
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class CurveTestScene extends Phaser.Scene
{
    /** @type {CurveTestScene} */
    static instance = undefined;

    /** @type {TickPlay} */
    _tickPlay = null;

    /** @type {DebugTextButton} */
    _dbgTxtBtn = null;

    constructor()
    {
        super('CurveTestScene');
        CurveTestScene.instance = this;

        /** @type {Phaser.GameObjects.Graphics} */
        this.graphics = undefined;

        this.lineDataArr = undefined;
        this.lineObjIndex = 0;
        this.lineObjArr = undefined;

        this.dotDataArr = undefined;
        this.dotObjIndex = 0;
        this.dotObjArr = undefined;

        this._tickPlay = new TickPlay();
        console.log(this.constructor.name, ': done');
    }

    preload()
    {
        this.load.image('click_box', './assets/16x16.png');
    }

    create()
    {
        this.graphics = this.add.graphics(); // this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

        this.lineDataArr = [
            { fillStyle:{color:0xffffff, size:1, alpha:1.0 }, from:{x:0, y:0}, to:{x:100, y:200 } },
            { fillStyle:{color:0xff0000, size:1, alpha:1.0 }, from:{x:200, y:50}, to:{x:200, y:400} }
        ];
        this.lineObjArr = [];

        this.dotDataArr = [
            { fillStyle:{color:0xff00ff, size:10, alpha:1.0 }, to:{x:100, y:200 } },
        ];
        this.dotObjArr = [];

        let img1 = this.add.image(100, 100, 'click_box');
        img1.setInteractive();
        this.input.setDraggable(img1);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this._dbgTxtBtn = new DebugTextButton();
        this._dbgTxtBtn.init(this, "DEUBG btn");
        this._dbgTxtBtn.setClickCallback(() => {
            console.log('onclick - onclick');
        });

        this._tickPlay.start();
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
            let spec = this.lineDataArr[i];
            line.x1 = spec.from.x;
            line.y1 = spec.from.y;
            line.x2 = spec.to.x;
            line.y2 = spec.to.y;

            this.graphics.lineStyle(spec.fillStyle.size, spec.fillStyle.color, spec.fillStyle.alpha);
            this.graphics.strokeLineShape(line);
        }

        for(let i = 0; i < this.dotDataArr.length; i++)
        {
            let dot = this.getDot();
            let spec = this.dotDataArr[i];
            dot.x = spec.to.x;
            dot.y = spec.to.y;

            this.graphics.fillStyle(spec.fillStyle.color, spec.fillStyle.alpha);
            this.graphics.fillPointShape(dot, spec.fillStyle.size);

            //dot.setInteractive();
            // dot.input.on('pointermove', function(pointer) {
            //     dot.x = pointer.x;
            //     dot.y = pointer.y;
            // });
        }
    }
}

class DebugTextButton
{
    /** @type {Phaser.GameObjects.Text} */
    _text = null;

    /** @type {() => void} */
    _onClick = null;

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     */
    init(scene, text, x, y, style, onClickResponse)
    {
        x = x ? x : 0;
        y = y ? y : 0;
        style = style ? style : { color: '#00ff00' };

        if(onClickResponse) {
            this._onClick = onClickResponse;
        }

        this._text = scene.add.text(x, y, text);
        this._text.setInteractive();

        this._text.on('pointerdown', () => {
            console.log('on click');
            this._onClick && this._onClick();
        });
    }

    setClickCallback(onClickResponse) 
    {
        this._onClick = onClickResponse;
    }
}