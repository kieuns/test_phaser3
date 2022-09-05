
import Phaser from 'phaser'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class UI_TextButton
{
    /** @type {Phaser.GameObjects.Text} */
    _text = null;
    /** @type {Phaser.GameObjects.Text} */
    _hiddenText = null;
    /** @type {() => void} */
    _onClick = null;

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {JSON} style
     * @param {function} onClickResponse
     */
    constructor(scene, text, x, y, style, onClickResponse) {
        this.init(scene, text, x, y, style, onClickResponse);
    }

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {JSON} style
     * @param {function} onClickResponse
     */
    init(scene, text, x, y, style, onClickResponse)
    {
        x = x ? x : 0;
        y = y ? y : 0;
        style = style ? style : { color: '#00ff00' };

        if(onClickResponse)
        {
            this._onClick = onClickResponse;
        }

        this._text = scene.add.text(x, y, text);
        this._text.setInteractive();

        this._text.on('pointerdown', () =>
        {
            console.log('on click');
            this._onClick && this._onClick();
        });

        this._hiddenText = scene.add.text(x, y, text);
        this._hiddenText.active = false;
    }

    setPosition(x, y) {
        this._text.setPosition(x, y);
        this._hiddenText.setPosition(x, y);
    }

    /** @param {Function} onClickResponse */
    setClickCallback(onClickResponse) {
        this._onClick = onClickResponse;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class UI_Button
{
    /** @type {Phaser.GameObjects.Text} */
    _text = null;
    /** @type {Phaser.GameObjects.Text} */
    _hiddenText = null;
    /** @type {() => void} */
    _onClick = null;

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {JSON} style
     * @param {function} onClickResponse
     */
    constructor(scene, text, x, y, style, onClickResponse)
    {
        this.init(scene, text, x, y, style, onClickResponse);
    }

    /**
     * @param {Phaser.Scene} scene
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {JSON} style
     * @param {function} onClickResponse
     */
    init(scene, text, x, y, style, onClickResponse)
    {
        x = x ? x : 0;
        y = y ? y : 0;
        style = style ? style : { color: '#00ff00' };

        if(onClickResponse) {
            this._onClick = onClickResponse;
        }

        this._text = scene.add.text(x, y, text);
        this._text.setInteractive();

        this._text.on('pointerdown', () =>
        {
            console.log('on click');
            this._onClick && this._onClick();
        });

        this._hiddenText = scene.add.text(x, y, text);
        this._hiddenText.active = false;
    }

    setPosition(x, y) {
        this._text.setPosition(x, y);
        this._hiddenText.setPosition(x, y);
    }

    /** @param {Function} onClickResponse */
    setClickCallback(onClickResponse) {
        this._onClick = onClickResponse;
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////