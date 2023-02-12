

# 팁팁

```
export class GameData {
    public static stat:GameStat = null;
};
```

* 널 초기화 하려는데 아래 같은 에러가 뜬다면,

```'null' 형식은 'GameStat' 형식에 할당할 수 없습니다.ts(2322)```

tsconfig.json 파일에서 ```"strictNullChecks": false,``` 를 추가해서 검사를 막는다.

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

# eslint

* Configuring ESLint: https://eslint.org/docs/latest/user-guide/configuring/

---

# threejs

```
npm install --save three-addons
```

----

![phaser3-parceljs-template](https://user-images.githubusercontent.com/2236153/71606463-37a0da80-2b2e-11ea-9b5f-5d26ccc84f91.png)

# Phaser 3 + TypeScript + Parcel Template
> For people who want to spend time making Phaser 3 games in TypeScript instead of configuring build tools.

![License](https://img.shields.io/badge/license-MIT-green)

This is a TypeScript specific fork of [phaser3-parcel-template](https://github.com/ourcade/phaser3-parcel-template).

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/), [npm](https://www.npmjs.com/), and [Parcel](https://parceljs.org/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm.

For Windows users there is [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows).

Install Node.js and `npm` with `nvm`:

```bash
nvm install node

nvm use node
```

Replace 'node' with 'latest' for `nvm-windows`.

Then install Parcel:

```bash
npm install -g parcel-bundler
```

## Getting Started

Clone this repository to your local machine:

```bash
git clone https://github.com/ourcade/phaser3-typescript-parcel-template.git
```

This will create a folder named `phaser3-typescript-parcel-template`. You can specify a different folder name like this:

```bash
git clone https://github.com/ourcade/phaser3-typescript-parcel-template.git my-folder-name
```

Go into your new project folder and install dependencies:

```bash
cd phaser3-typescript-parcel-template # or 'my-folder-name'
npm install
```

Start development server:

```
npm run start
```

To create a production build:

```
npm run build
```

Production files will be placed in the `dist` folder. Then upload those files to a web server. 🎉

## Project Structure

```
    .
    ├── dist
    ├── node_modules
    ├── public
    ├── src
    │   ├── scenes
    │   │   ├── HelloWorldScene.ts
    │   ├── index.html
    │   ├── main.ts
    ├── package.json
```

The contents of this template is the basic [Phaser 3 getting started example](http://phaser.io/tutorials/getting-started-phaser3/part5).

This template assumes you will want to organize your code into multiple files and use TypeScript.

TypeScript files are intended for the `src` folder. `main.ts` is the entry point referenced by `index.html`.

Other than that there is no opinion on how you should structure your project. There is a `scenes` folder in `src` where the `HelloWorldScene.ts` lives but you can do whatever you want.

## Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served at http://localhost:8000/images/my-image.png

Example `public` structure:

```
    public
    ├── images
    │   ├── my-image.png
    ├── music
    │   ├── ...
    ├── sfx
    │   ├── ...
```

They can then be loaded by Phaser with `this.image.load('my-image', 'images/my-image.png')`.

## TypeScript ESLint

This template uses a basic `typescript-eslint` set up for code linting.

It does not aim to be opinionated.

## Dev Server Port

You can change the dev server's port number by modifying the `start` script in `package.json`. We use Parcel's `-p` option to specify the port number.

The script looks like this:

```
parcel src/index.html -p 8000
```

Change 8000 to whatever you want.

## Other Notes

[parcel-plugin-clean-easy](https://github.com/lifuzhao100/parcel-plugin-clean-easy) is used to ensure only the latest files are in the `dist` folder. You can modify this behavior by changing `parcelCleanPaths` in `package.json`.

[parcel-plugin-static-files](https://github.com/elwin013/parcel-plugin-static-files-copy#readme) is used to copy static files from `public` into the output directory and serve it. You can add additional paths by modifying `staticFiles` in `package.json`.

## License

[MIT License](https://github.com/ourcade/phaser3-typescript-parcel-template/blob/master/LICENSE)
