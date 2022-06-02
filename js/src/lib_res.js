
/**
 * @typedef {Object} ResInfo
 * @property {object} BoardViewSpec
 * @property {number} BoardViewSpec.tileXLen
 * @property {number} BoardViewSpec.tileYLen
 * @property {number} BoardViewSpec.tilePixelWidth
 * @property {number} BoardViewSpec.tilePixelHeight
 * @property {object} BasicSet
 * @property {object} BasicSet.bg
 * @property {object} BasicSet.tile_bg
 * @property {object} BasicSet.block_1
 * @property {string} BasicSet.block_1.key
 * @property {string} BasicSet.block_1.filename
 * @property {object} BasicSet.block_2
 * @property {string} BasicSet.block_2.key
 * @property {string} BasicSet.block_2.filename
 * @property {object} BasicSet.block_3
 * @property {string} BasicSet.block_3.key
 * @property {string} BasicSet.block_3.filename
 * @property {object} BasicSet.block_4
 * @property {string} BasicSet.block_4.key
 * @property {string} BasicSet.block_4.filename
 * @property {object} BasicSet.block_5
 * @property {string} BasicSet.block_5.key
 * @property {string} BasicSet.block_5.filename
 * @property {object} BasicSet.block_6
 * @property {string} BasicSet.block_6.key
 * @property {string} BasicSet.block_6.filename
 */
export var ResInfo =
{
    BoardViewSpec: {
        tileXLen:9, tileYLen:9,
        tilePixelWidth:70, tilePixelHeight:70
    },
    Param: {
        default_x : 100, default_y : 100,
    },
    //
    // FORMAT :: (Title) :{ key:'bg-001', filename:'assets/background.jpg', displayWidth:00, displayHeight:00 },
    //
    BasicSet: {
        bg:{ key:'bg-001', filename:'assets/background.jpg' },
        tile_bg:{ key:'tile-bg-001', filename:'assets/block_glow.png' },
        block_1: { key: 'block_blue', filename: 'assets/blue.png' },
        block_2: { key: 'block_green', filename: 'assets/green.png' },
        block_3: { key: 'block_orange', filename: 'assets/orange.png' },
        block_4: { key: 'block_red', filename: 'assets/red.png' },
        block_5: { key: 'block_violet', filename: 'assets/violet.png' },
        block_6: { key: 'block_yellow', filename: 'assets/yellow.png' },
    }
};
