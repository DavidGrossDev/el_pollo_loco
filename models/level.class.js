/**
 * @typedef {Object} LevelElements
 * @property {Enemy[]} enemies
 * @property {Cloud[]} clouds
 * @property {BackgroundObject[]} backgroundObjects
 * @property {Coin[]} coins
 * @property {Bottle[]} bottles
 */

/**
 * Represents a game level with enemies, background elements and collectibles.
 *
 * @property {Enemy[]} enemies - Enemy entities in the level.
 * @property {Cloud[]} clouds - Cloud sprites.
 * @property {BackgroundObject[]} backgroundObjects - Layers/background objects.
 * @property {Coin[]} coins - Collectible coins.
 * @property {Bottle[]} bottles - Collectible bottles.
 * @property {number} level_end_x - X coordinate where the level ends.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 2500;
    
    /**
     * Create a Level instance.
     * @param {Enemy[]} enemies
     * @param {Cloud[]} clouds
     * @param {BackgroundObject[]} backgroundObjects
     * @param {Coin[]} coins
     * @param {Bottle[]} bottles
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}