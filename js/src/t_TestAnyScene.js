
import Phaser from 'phaser'

// class doc
// -
// example
// -

export class TestAnyScene extends Phaser.Scene
{
    static instance = undefined;

    constructor()
    {
        super('TestAny');
        TestAnyScene.instance = this;
        console.log(this.constructor.name, "constructor(): done");
    }

    preload()
    {
        this.load.image('box', './assets/box.png');
        this.load.image('pixel', './assets/16x16.png');
        console.log(this.constructor.name, 'preload() : done');
    }

    create()
    {
        this.input.mouse.disableContextMenu();

        this.add.image(100, 100, 'box');
        const source = this.textures.get('box').source[0].image;

        const canvas = this.textures.createCanvas('pad', source.width, source.height).source[0].image;

        let target_w = 40;
        let target_h = 40;
        // @ts-ignore
        const ctx = canvas.getContext('2d');
        ctx.drawImage(source, 0, 0);
        const imageData = ctx.getImageData(0, 0, target_w, target_h);

        let x = 0;
        let y = 0;

        let center_x = this.cameras.main.width / 2;
        let center_y = this.cameras.main.height / 2;

        const color = new Phaser.Display.Color();
        for(let i = 0; i < imageData.data.length; i += 4)
        {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const a = imageData.data[i + 3];

            if(a > 0)
            {
                const startX = Phaser.Math.Between(0, this.cameras.main.width);
                const startY = Phaser.Math.Between(0, this.cameras.main.height);

                const dx = (center_x - source.width/2) + x * 4;
                const dy = (center_y - source.height/2) + y * 4;

                const image = this.add.image(startX, startY, 'pixel').setScale(0);
                color.setTo(r, g, b, a);
                image.setTint(color.color);

                this.tweens.add({
                    targets: image,
                    duration: 2000,
                    x: dx,
                    y: dy,
                    scaleX: 1,
                    scaleY: 1,
                    angle: 360,
                    delay: i / 1.5,
                    yoyo: true,
                    repeat: -1,
                    repeatDelay: 6000,
                    hold: 6000
                });
            }
            x++;
            if (x === target_w)
            {
                x = 0;
                y++;
            }
        }
    }

}
