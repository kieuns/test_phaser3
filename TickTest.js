import { XY } from "./gametype.js";
import { GameData, GameOption } from "./main.js";
import { ResInfo } from "./res.js";

class TickHandler
{
    constructor()
    {
        this.tickDur = 1000;
        this.tickTimerId = undefined;

        this.tickCount = 0;
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
    constructor()
    {
        this.sprite = undefined;
        this.fromPos = undefined;
        this.toPos = undefined;
    }

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

