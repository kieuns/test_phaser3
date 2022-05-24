
# 페이져 세팅




# 정보 모음

## visual studio code : 자바스크립트 프로그래밍 설정

가이드 : https://code.visualstudio.com/docs/nodejs/working-with-javascript

## Type checking JavaScript

첫줄에 추가하면 타입 검사를 해준다.

```
//@ts-check
```

## 모듈 포함하는

```
// CommonJS:
const dat = require('dat.gui');

// ES6:
import * as dat from 'dat.gui';

const gui = new dat.GUI();
```



# Pool

## 예제

## 예시1

* http://phaser.io/examples/v3/view/pools/bullets
* https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#group__anchor
* https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Group.html

``` javascript
// 풀에 사용할 클래스 선언
var PoolItemClass = Phaser.Class({ ... });
// 풀을 group으로 담기
var pool_objects = add.group({ classType: PoolItemClass, maxSize: 10, runChildUpdate: true });
// 얻기
var pool_item = pool_objects.get();
// PoolItemClass 에 선언된 것을 그대로 사용할 수 있다.
// 아이템은 사용 종료시에는
pool_item.setActive(false);
pool_item.setVisible(false);
```

## 예시2

* http://phaser.io/examples/v3/view/pools/create-pool

풀에 넣는 것은 ``the.load.image``로 로딩한 오브젝트도 가능하다.
비활성화는 어떻게 하는지 모르겠지만

``` javascript
this.load.image('cokecan', 'assets/sprites/cokecan.png');
}var pool_objects = this.add.group({ defaultKey: 'cokecan', maxSize: 10 });
cans.get(x, 300);
```


# 오브젝트드래깅

이미지 오브젝트에 setInteractive() 호출.
this.input. 에 setDraggable(image); 이미지 추가
this.input.on('drag' .. 이벤트 연결 함수 만들어서 오브젝트 이동 처리

``` javascript
function create() {
    var img = this.add.image( x, y, 'img');
    img.setInteractive();
    this.input.setDraggable(img);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });
}
```

setInteractive() 는 지오메트리 오브젝를 파라미터로 받을 수 있음

this.input.on() 의 이벤트 이름
  * 'dragstart' / 'drag' / 'dragend'

``` javascript
this.input.on('dragstart', function (pointer, gameObject) {}

this.input.on('drag', function (pointer, gameObject, dragX, dragY) {}
```

image 오브젝트에 직접 거는 이벤트 ( image.on('..') )
  * 'pointerdown' / 'pointerover' / 'pointerout'

  * 'gameobjectover' / 'gameobjectout'

``` javascript
this.input.on('gameobjectover', function (pointer, gameObject) {}
this.input.on('gameobjectout', function (pointer, gameObject) {}
```

## 멀티플 드래깅

``` javascript
//  Grab everything under the pointer
this.input.topOnly = false;
```

# GameObject

  * setTint() / clearTint()

  * Phaser.Actions.Rotate( 오브젝트들, 각도인듯 드그리인가? )

# 멀티카메라

``` javascript
this.cameras.add(...)
// this는 Phaser.Scene
```

# 카메라

키보드로 카메라 스크롤 하는 기능 있음

``` javascript
function create ()
{
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 0.7
    };
    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}
function update (time, delta)
{
    controls.update(delta);
}
```

# 그래픽스

텍스쳐를 만들수 있음 : ```graphics.generateTexture('block', 32, 32);```


# 그룹

그룹에 다수의 오브젝트를 넣고, 클릭 영역 (hitarea)를 지정할 수 있음

``` javascript
    //  All the Images can share the same Shape, no need for a unique instance per one, a reference is fine
    var hitArea = new Phaser.Geom.Rectangle(0, 0, 32, 32);
    var hitAreaCallback = Phaser.Geom.Rectangle.Contains;

    //  Create 10,000 Image Game Objects aligned in a grid
    //  Change this to 2000 on MS Edge as it can't seem to cope with 10k at the moment
    group = this.make.group({
        classType: Phaser.GameObjects.Image,
        key: 'bobs',
        frame: Phaser.Utils.Array.NumberArray(0, 399),
        randomFrame: true,
        repeat: 24,
        max: 10000,
        hitArea: hitArea,
        hitAreaCallback: hitAreaCallback,
        gridAlign: {
            width: 100,
            cellWidth: 32,
            cellHeight: 32
        }
    });
```

``` javascript ```

``` javascript
```

# 입력

씬에서 입력을 받기

create() 함수에서 this.input.on() 으로 이벤트 함수 설정

``` javascript
this.input.on('gameout', function () { console.log('gameout'); });
this.input.on('gameover', function () { console.log('gameover'); });
```

GameObject 에서 입력 받기

  * GameObject.setInteractive()

```
var shape = new Phaser.Geom.Ellipse(33, 67, 66, 133);
sprite.setInteractive(shape, Phaser.Geom.Ellipse.Contains);
```

마우스포인터 사용

``` javascript
function update() {
    var pointer = this.input.activePointer;
    text.setText([
        'x: ' + pointer.worldX,
        'y: ' + pointer.worldY,
        'isDown: ' + pointer.isDown,
        'rightButtonDown: ' + pointer.rightButtonDown()
    ]);
}
```

입력 이벤트 응답 함수의 파라미터

  * ```Phaser.Input. Pointer```
  * 입력의 응답 함수의 파라미터 레퍼런스 : [Phaser.Input.Pointer.html](https://photonstorm.github.io/phaser3-docs/Phaser.Input.Pointer.html)
  * 살아 있는 입력 이벤트는, ```InputPlugin.activePointer``` 로 접근 가능
  * 또는 ```InputPlugin.pointer1``` 에서 ```pointer10``` 의 변수로 접근 가능

입력 이벤트

  * pointerdown / pointerout / pointerup / pointermove

``` javascript
// this : Phaser.Scene
this.input.on('pointerdown', function (pointer) { this.add.image(pointer.x, pointer.y, 'logo'); });
```

```
(GameObject).on('pointerdown', function (pointer) { this.add.image(pointer.x, pointer.y, 'logo'); });
```

  * pointerover / pointerout

  * pointerup

  * gameout / gameover

  * gameobjectdown

```
this.input.on('gameobjectdown', function (pointer, gameObject) { gameObject.visible = false; });
```



# dom 엘리먼트 사용

  * https://photonstorm.github.io/phaser3-docs/Phaser.DOM.html

```new Phaser.Game(config)```에 들어갈 설정 내용 중에 돔 컨테이너 사용을 **true** 로 설정

``` javascript
  const config = {
    type: Phaser.AUTO,
    dom: { createContainer: true }, // 페이져에서 돔 엘리먼트 사용하게 하기
    parent: 'game_main',
    width: 600,
    height: 800,
    backgroundColor: '#2d2d2d',
    scene: [TestScene]
  };
  const game = new Phaser.Game(config);

```

**create()** 함수에서 임의 버튼 **BULMA** 를 사용해서 추가

``` javascript
create()
{
  // <button class="button is-primary">CLICK</button>
  const button = document.createElement('div');
  button.className = 'button is-primary';
  button.innerText = 'CLICK';
  this.add.dom(cx-100, cy-100, button);
}
```

## jsx-dom : 하드코딩을 피하는 길

* https://blog.ourcade.co/posts/2020/dom-element-button-phaser-3-typescript-rxjs-jsx/
* 리액트 엘리먼트
* jsx-dom 을 임포트

html을 그대로 사용해서 오브젝트 생성해서 갖다 쓰기

```
const button =
```