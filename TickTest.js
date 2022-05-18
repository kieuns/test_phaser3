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

    move(fromPos, toPos)
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
        console.log(this.constructor.name, ': done');
    }

    preload()
    {
        console.log(this.constructor.name, ': preload : done');
        this.tickHandler.start();
    }

    create()
    {
    }

    update(time, delta)
    {
    }
};

