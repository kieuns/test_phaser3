
# RenderTexture

* `Phaser.GameObjects. RenderTexture`

```
var scrn_x = 0;
var scrn_y = 0;
var x_size = 100;
var y_size = 100;
var rt = this.scene.add.renderTexture(scrn_x, scrn_y, x_size, y_size);
```

---

# Scene

## 현재 Scene

* `Phaser.GameObjects.GameObject` 모든 게임 오브젝트의 부모
* `scene :Phaser.Scene` 를 갖고 있다.

---

# text

* [Phaser.GameObjects.Text](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html)

## style

* [TextStyle](https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html#.TextStyle)

```
{ font: '64px Arial' })
{ fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
```

----

# group

```
this.group = this.add.group();
this.group.add(this.cont1);
this.group.add(this.cont2);
```

---

# tween

* 문서 링크 : [TweenManager](https://photonstorm.github.io/phaser3-docs/Phaser.Tweens.TweenManager.html)
/ [Phaser.Types.Tweens](https://photonstorm.github.io/phaser3-docs/Phaser.Types.Tweens.html)
/ [TweenBuilderConfig](https://photonstorm.github.io/phaser3-docs/Phaser.Types.Tweens.html#.TweenBuilderConfig)

* 만들기: [add()](https://photonstorm.github.io/phaser3-docs/Phaser.Tweens.TweenManager.html#add__anchor) / [create()](https://photonstorm.github.io/phaser3-docs/Phaser.Tweens.TweenManager.html#create__anchor)

* 트윈 만들때의 파라미터: [NumberTweenBuilderConfig](https://photonstorm.github.io/phaser3-docs/Phaser.Types.Tweens.html#.NumberTweenBuilderConfig)


```
let tween = scene.tweens.add( {to:1.2, ... 파라미터 ...} );

tween.stop();
```

* [TweenOnStartCallback](https://photonstorm.github.io/phaser3-docs/Phaser.Types.Tweens.html#.TweenOnStartCallback)

```
let on_start = function (tween, targets) {
    targets[0].setScale(1,1);
    targets[0].setVisible(true);
};
let on_complete = function (tween, targets) {
    targets[0].setVisible(false);
};
this._clickTween = this._scene.tweens.add({
    targets:this._hiddenText, scale:1.2, duration: 150,
    onStart: on_start,
    onComplete: on_complete
});
```

* [Easing 이징](https://photonstorm.github.io/phaser3-docs/Phaser.Math.Easing.html)
* [Ease Equations](https://phaser.io/examples/v3/view/tweens/ease-equations)

```
 var eases = [
    'Linear',
    'Quad.easeIn',
    'Cubic.easeIn',
    'Quart.easeIn',
    'Quint.easeIn',
    'Sine.easeIn',
    'Expo.easeIn',
    'Circ.easeIn',
    'Back.easeIn',
    'Bounce.easeIn',
    'Quad.easeOut',
    'Cubic.easeOut',
    'Quart.easeOut',
    'Quint.easeOut',
    'Sine.easeOut',
    'Expo.easeOut',
    'Circ.easeOut',
    'Back.easeOut',
    'Bounce.easeOut',
    'Quad.easeInOut',
    'Cubic.easeInOut',
    'Quart.easeInOut',
    'Quint.easeInOut',
    'Sine.easeInOut',
    'Expo.easeInOut',
    'Circ.easeInOut',
    'Back.easeInOut',
    'Bounce.easeInOut'
];
```

----

# 랜덤

```
var x = Phaser.Math.Between(0, 800);
var y = Phaser.Math.Between(0, 600);
```

---

# 기타

* `Phaser.Math.Distance.Between()`

---

# example web

* [web-root](https://phaser.io/examples/v3/category/scenes)
* [example github](https://github.com/photonstorm/phaser3-examples)

# scenes

* [scenes exam](https://phaser.io/examples/v3/category/scenes)

# reference

도움말
* [페이져3 메인](https://photonstorm.github.io/phaser3-docs/Phaser.html)
* [game] : https://photonstorm.github.io/phaser3-docs/Phaser.Game.html
* [game.scene] : https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html
* [카메라] : https://photonstorm.github.io/phaser3-docs/Phaser.Cameras.Scene2D.Camera.html#width__anchor
* [입력] : https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputManager.html (game.input)
* [입력 이벤트] : https://photonstorm.github.io/phaser3-docs/Phaser.Input.Events.html
* [Phaser.Input.InputPlugin]:https://photonstorm.github.io/phaser3-docs/Phaser.Input.InputPlugin.html
