
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