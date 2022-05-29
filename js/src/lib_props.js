/* eslint-disable no-unused-vars */
import { ResInfo } from "./lib_res.js";
import Phaser from 'phaser'

// @ts-ignore
var AFxClickReactor = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function AFxClickReactor(scene)
    {
        this.tileImgKey = ResInfo.BasicSet.tile_bg.key;
        Phaser.GameObjects.Image.call(this, scene, 0, 0, this.tileImgKey);
    }
});

