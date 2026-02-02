/**
 * @typedef {'LEFT'|'RIGHT'|'UP'|'DOWN'|'SPACE'|'G'} KeyName
 */

/**
 * Container for current keyboard state (which keys are pressed).
 *
 * @property {boolean} LEFT
 * @property {boolean} RIGHT
 * @property {boolean} UP
 * @property {boolean} DOWN
 * @property {boolean} SPACE
 * @property {boolean} G
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    G = false;
}