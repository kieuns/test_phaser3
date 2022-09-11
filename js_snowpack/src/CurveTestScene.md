
//#region [참고용 웹 링크]
/*
// [class doc]
// - graphics : https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Graphics.html
// [example]
// - geom : http://phaser.io/examples/v3/category/geom
// - https://phaser.io/examples/v3/view/game-objects/graphics/obj-scene
// [입력]
// - InputManager : https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputPlugin.html
// - setInteractive : https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObject.html#setInteractive__anchor
// [example]
// - https://phaser.io/examples/v3/view/game-objects/dom-element/input-test
// - https://phaser.io/examples/v3/category/input
// - game-objects/dom-element/InputTest
// - https://phaser.io/examples/v3/search?search=input
//
// [ex1]
graphics.lineStyle(5,0xFF00FF,1.0);
graphics.beginPath();
graphics.moveTo(100,100);
graphics.lineTo(200,200);
graphics.closePath();
graphics.strokePath();
// [ex2]
graphics.lineStyle(5,0xFF00FF, 1.0);
graphics.fillStyle(0xFFFFFF, 1.0);
graphics.fillRect(50, 50, 400, 200);
graphics.strokeRect(50, 50, 400, 200);
// [입력처리]
var sprite = this.add.sprite(x, y, texture);
sprite.setInteractive();
sprite.on('pointerdown', callback, context);
*/
//#endregion
