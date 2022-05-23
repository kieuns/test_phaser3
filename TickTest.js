import { XY } from "./gametype.js";
import { GameData, GameOption } from "./main.js";
import { ResInfo } from "./res.js";

class TickHandler
{
    #tickDur = 1000;
    #tickTimerId = undefined;
    #tickCount = 0;

    constructor()
    {
    }

    start()
    {
        this.tickCount = 0;
        this.tickTimerId = setInterval(this.onTick.bind(this), this.tickDur);
        console.log(this.tickCount);
    }

    stop()
    {
        clearInterval(this.tickTimerId);
    }

    onTick()
    {
        this.tickCount += 1;
        console.log('onTick() : ', this.tickCount);
    }

    reserve()
    {
    }

    register()
    {
    }
}

class ObjectMover
{
    #sprite = undefined;
    #fromPos = undefined;
    #toPos = undefined;

    initWith(spriteObj)
    {
    }

    setMovParam(fromPos, toPos)
    {
    }

    start()
    {
    }

    onMove()
    {
    }
}

class SimpleLine
{
    #startPos = new Phaser.Math.Vector2(-100, -100);
    #endWPos = new Phaser.Math.Vector2(-100, -100);

    setStartPosition(x, y)
    {
        this.startWPos.set(x,y);
        this.endWPos.set(x,y);
    }

    setEndPosition(x, y)
    {
        this.endWPos.set(x,y);
    }

    cancel() {
        this.startWPos.set(-100, -100);
        this.endWPos.set(-100, -100);
    }

    updateEndPosition(x, y)
    {
        this.endWPos.x = x;
        this.endWPos.y = y;
    }

}

class clickedLine
{
    _simpleLine = new SimpleLine();
    _scene = null;

    constructor(scene)
    {
        this._scene = scene;
    }

    firstClick(x, y)
    {
        this._simpleLine.setStartPosition(x,y);
    }

    updateEndPosition(x, y)
    {
        this.updateEndPosition(x, y);
    }

    close()
    {
        this.setEndPosition();
    }
}

export default class TickTest extends Phaser.Scene
{
    static instance = undefined;

    constructor()
    {
        super('TickTest');

        TickTest.instance = this;

        this.tickHandler = new TickHandler();
        this.objMov1 = new ObjectMover();

        this.mouseDown = false;

        this.clickedLine = null;

        console.log(this.constructor.name, ': done');
    }

    preload()
    {
        this.load.image('missile', './assets/rocket.png');
        console.log(this.constructor.name, ': preload : done');
    }

    create()
    {
        this.objMov1.initWith(this.add.image(0, 0, 'missile'));
        this.input.on('pointerdown', this.onPointerDown);
        this.input.on('pointerup', this.onPointerUp);
        this.input.on('gameout', this.onPointerUp); // canvas out
        this.input.on('pointermove', this.onPointerMove);
    }

    update(time, delta)
    {
    }

    onPointerDown(pointer)
    {
        this.mouseDown = true;
        console.log('onPointerDown');
    }

    onPointerUp(pointer)
    {
        this.mouseDown = false;
        console.log('onPointerUp');
    }

    onPointerMove(pointer)
    {
        if(this.mouseDown) {
            console.log('onPointerMove');
        }
    }
};

