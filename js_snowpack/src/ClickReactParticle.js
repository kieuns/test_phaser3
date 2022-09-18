


class ClickReactSmallParticle
{
    /** @type {Phaser.GameObjects.Image} */
    _img = null;
}

class ClickReactParticle
{
    /** @type {ClickReactSmallParticle[]} */
    _smallParticle = [];

    /** @type {string} 쓸 이미지 리소스 이름 */
    _particleImageName = null;

    /** @param {string} ptcImageName */
    constructor(ptcImageName) {
        this.create(ptcImageName);
    }

    /** @param {string} ptcImageName */
    create(ptcImageName)
    {
    }

    destroy()
    {
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    playEffect(x, y)
    {
    }
};

function ClickReactParticleExample()
{
    let obj1 = new ClickReactParticle("RESORUCE_NAME");

    obj1.playEffect(0, 0);

    // when delete
    obj1.destroy();
}