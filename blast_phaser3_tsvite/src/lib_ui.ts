
import Phaser from 'phaser'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class UI_TextButton
{
    /** @type {Phaser.Scene} */
    protected _scene:Phaser.Scene = null;
    /** @type {Phaser.GameObjects.Text} */
    protected _text:Phaser.GameObjects.Text = null;
    /** @type {Phaser.GameObjects.Text} */
    protected _hiddenText:Phaser.GameObjects.Text = null;
    /** @type {() => void} */
    protected _onClick:(() => void) = null;
    /** @type {Phaser.Tweens.Tween} */
    protected _clickTween:Phaser.Tweens.Tween = null;
    /** @type {Phaser.GameObjects.Container} */
    protected _container:Phaser.GameObjects.Container= null;

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {Json} style
     * @param {() => void} onClickResponse
     */
    constructor(scene:Phaser.Scene, text:string, x:number, y:number, style:object, onClickResponse:(()=>void)) {
        this.create(scene, text, x, y, style, onClickResponse);
    }

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {Json} style
     * @param {() => void} onClickResponse
     */
    create(scene:Phaser.Scene, text:string, x:number, y:number, style:object, onClickResponse:(()=>void))
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

    setPosition(x:number, y:number) {
        this._container.setPosition(x, y);
    }

    /** @param {() => void} onClickResponse */
    setClickCallback(onClickResponse:(()=>void)) {
        this._onClick = onClickResponse;
    }

    playClickFx() {
        let on_start = (tween:Phaser.Tweens.Tween, targets:any[]) => {
            targets[0].setScale(1,1);
            targets[0].setVisible(true);
            targets[0].clearAlpha();
        };
        let on_complete = (tween:Phaser.Tweens.Tween, targets:any[]) => {
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
export interface IButtonEvent
{
    _text: Phaser.GameObjects.Text;

    // _onClick: (()=>void);
    // setClickEvent: (()=>void);

    // /** @param {()=>void} evtFunc */
    // setClickEvent(evtFunc:(()=>void)) { this._onClick = evtFunc; }
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
    protected _hiddenText:Phaser.GameObjects.Text = null;
    /** @type {() => void} */
    protected _onClick:(()=>void) = null;
    /** @type {Phaser.GameObjects.RenderTexture} */
    protected _renderTexture:Phaser.GameObjects.RenderTexture = null;

    /** @type {number} */
    _x:number = 0;
    /** @type {number} */
    _y:number = 0;
    /** @type {number} */
    _cx:number = 0;
    /** @type {number} */
    _cy:number = 0;

    _text: Phaser.GameObjects.Text;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} cx
     * @param {number} cy
     */
    constructor(scene:Phaser.Scene, x:number, y:number, cx:number, cy:number)
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
    create(scene:Phaser.Scene, x:number, y:number, cx:number, cy:number)
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

    setText(text:string, style:object)
    {
        style = style ? style : { color: '#00ff00' };
        this._text.setText(text);
        this._text.setStyle(style);
        this._hiddenText.setText(text);
    }

    setPosition(x:number, y:number)
    {
        this._text.setPosition(x, y);
        this._hiddenText.setPosition(x, y);
    }

    setBgImage(img:Phaser.GameObjects.Image)
    {
    }

    setClickEvent(evtFunc:(()=>void)) {
        this._onClick = evtFunc;
    }

}
//Object.assign(UI_Button.prototype, ButtonEvent);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////