
import Phaser from 'phaser'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class UI_TextButton
{
    /** @type {Phaser.Scene} */
    _scene = null;
    /** @type {Phaser.GameObjects.Text} */
    _text = null;
    /** @type {Phaser.GameObjects.Text} */
    _hiddenText = null;
    /** @type {() => void} */
    _onClick = null;
    /** @type {Phaser.Tweens.Tween} */
    _clickTween = null;
    /** @type {Phaser.GameObjects.Container} */
    _container = null;

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {JSON} style
     * @param {() => void} onClickResponse
     */
    constructor(scene, text, x, y, style, onClickResponse) {
        this.create(scene, text, x, y, style, onClickResponse);
    }

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {JSON} style
     * @param {() => void} onClickResponse
     */
    create(scene, text, x, y, style, onClickResponse)
    {
        this._scene = scene;

        x = x ? x : 0;
        y = y ? y : 0;
        style = style ? style : { color:'#ffffff', fontSize:'18px', fontFamily:'"Cascadia Code", D2Coding, "Lucida Sans Typewriter", Menlo, "Roboto Mono Medium", "DejaVu Sans Mono"' };

        if(onClickResponse) {
            this._onClick = onClickResponse;
        }

        this._container = scene.add.container(x, y);

        this._text = scene.add.text(0, 0, text);
        this._text.setInteractive();
        this._text.setStyle(style);

        this._text.on('pointerdown', () => { //console.log('on click');
            if(this._onClick) {
                this.playClickFx();
                this._onClick();
            }
            else {
            }
        });

        let style2 = { color:'#aaa', fontSize:'18px', fontFamily:'"Cascadia Code", D2Coding, "Lucida Sans Typewriter", Menlo, "Roboto Mono Medium", "DejaVu Sans Mono"' };
        this._hiddenText = scene.add.text(0, 0, text);
        this._hiddenText.setStyle(style2);
        this._hiddenText.setVisible(false);
        this._hiddenText.setOrigin(0.5, 0.5);
        let center_pos = this._text.getCenter();
        this._hiddenText.setPosition(center_pos.x, center_pos.y);//(this._text.width / 2, this._text.height / 2);

        this._container.add(this._text);
        this._container.add(this._hiddenText);
    }

    setPosition(x, y) {
        this._container.setPosition(x, y);
    }

    /** @param {() => void} onClickResponse */
    setClickCallback(onClickResponse) {
        this._onClick = onClickResponse;
    }

    playClickFx() {
        let on_start = (tween, targets) => {
            targets[0].setScale(1,1);
            targets[0].setVisible(true);
            targets[0].clearAlpha();
        };
        let on_complete = (tween, targets) => {
            targets[0].setVisible(false);
        };
        this._clickTween = this._scene.tweens.add({
            targets:this._hiddenText,
            scaleX:1.5, duration: 400, alpha:0, ease:'Cubic.easeOut',
            onStart: on_start,
            onComplete: on_complete
        });
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 버튼 리액션 */
export let ButtonEvent =
{
    /** @type {Phaser.GameObjects.Text} */
    _text: null,
    /** @type {() => void} */
    _onClick: null,

    /** @param {()=>void} evtFunc */
    setClickEvent(evtFunc) {
        this._onClick = evtFunc;
    }
}

/**
 * @example
 * let btn = new UI_Button(scene, 0, 0, 10, 10);
 * btn.setText("abc");
 * btn.setPosition( 0, 0 );
 */
export class UI_Button extends Phaser.GameObjects.GameObject
{
    /** @type {Phaser.GameObjects.Text} */
    _hiddenText = null;
    /** @type {() => void} */
    _onClick = null;
    /** @type {Phaser.GameObjects.RenderTexture} */
    _renderTexture = null;

    /** @type {number} */
    _x = 0;
    /** @type {number} */
    _y = 0;
    /** @type {number} */
    _cx = 0;
    /** @type {number} */
    _cy = 0;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} cx
     * @param {number} cy
     */
    constructor(scene, x, y, cx, cy)
    {
        super(scene, 'UI_Button');
        //GameObject.call(this, scene, 'UI_Button');
        this.create(scene, x, y, cx, cy);
    }

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
    create(scene, x, y, cx, cy)
    {
        this._x = x ? x : 0;
        this._y = y ? y : 0;
        this._cx = cx ? cx : 0;
        this._cy = cy ? cy : 0;

        this._renderTexture = scene.add.renderTexture(this._x, this._y, this._cx, this._cy);

        this._hiddenText = scene.add.text(0, 0, '');
        this._hiddenText.active = false;

        this._text = scene.add.text(0, 0, '');
        //this._text.setInteractive(); // 텍스트 눌림 반응

        this._text.on('pointerdown', () => {
            console.log('on click');
            this._onClick && this._onClick();
        });
    }

    setText(text, style)
    {
        style = style ? style : { color: '#00ff00' };
        this._text.setText(text);
        this._text.setStyle(style);
        this._hiddenText.setText(text);
    }

    setPosition(x, y)
    {
        this._text.setPosition(x, y);
        this._hiddenText.setPosition(x, y);
    }

    setBgImage(img)
    {
    }
}
Object.assign(UI_Button.prototype, ButtonEvent);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////