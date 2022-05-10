import { ResInfo } from "./res.js";

var AFxClickReactor = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function AFxClickReactor(scene)
    {
        this.tileImgKey = ResInfo.BasicSet.tile_bg.key;
        Phaser.GameObjects.Image.call(this, scene, 0, 0, this.tileImgKey);
    }
});

