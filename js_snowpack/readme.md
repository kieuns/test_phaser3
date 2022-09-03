
---
# SnowPack 시작

* https://www.snowpack.dev/tutorials/quick-start

프로젝트를 초기화 한 후에, (`npm init` 라든지) snowpack 설치

```bash
# npm:
npm install --save-dev snowpack
```

snowpack cli 실행
```
npx snowpack [command]
```

`package.json` 에 실행하는 명령어 추가
```
// Recommended: package.json scripts
// npm run start (or: "yarn run ...", "pnpm run ...")
"scripts": {
    "start": "snowpack dev",
    "build": "snowpack build"
}
```

## 프로젝트 설정

`npx snowpack init` 실행시켜서 빈 콘피그 파일 만들어 둡니다.

* `snowpack.config.js` 파일이 생기면 `mount`에 폴더 설정 정보를 넣어서 입맛에 맞게 씁니다.

아래에서는 `public`, `src`, `assets` 폴더를 각각 설정해둡니다.

```json
module.exports = {
  mount: {
    public: { url:'/', static: true },
    src: { url: '/dist' },
    assets: { url: '/assets' }
  }
};
```

`*.js` 파일에서 `assets` 폴더에 있는 리소스를 써야한다면, `/assets`로 시작되는 폴더 경로를 입력해서
사용할 리소스(파일)를 씁니다.

```js
this.load.image('click_box', '/assets/16x16.png');
```

```html
<img src="/assets/circle_16.png" >
```

---
# 노드 패키지

* phaser : https://www.npmjs.com/package/phaser
* animejs : https://www.npmjs.com/package/animejs


---
# threejs

```
npm install --save three-addons
```