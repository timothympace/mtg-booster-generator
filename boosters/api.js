const crypto = require('crypto');

const Scryfall = require('../scryfall/api');
const ImageMagick = require('../utils/ImageMagick');
const nodeUtils = require('../utils/nodeUtils');
const config = require('./config');
const MtgSet = require('./MtgSet');

const imageCache = {};

class BoostersApi {
    static async getCachedBooster(id) {
        return imageCache[id];
    }
    
    static getBoosterId(booster) {
        return crypto.createHash('sha256')
            .update(booster.map(card => card.id).join(''))
            .digest('hex');
    }

    static async buildLandPackImage(setId) {
        const set = await new MtgSet(setId);
        const cards = set.all(config.PULL_TYPES.BASIC_LAND);
        const boosterId = this.getBoosterId(cards);
        const urls = cards.map(card => card.image_uris.png);

        let stream = ImageMagick.montage(urls);
        stream = ImageMagick.compress(stream);
        imageCache[boosterId] = nodeUtils.processStream(stream);

        return {
            id: boosterId,
            image: {
                url: null,
                width: 5,
                height: Math.ceil(cards.length / 5),
                number: cards.length
            },
            cards
        };
    }
    
    static async buildBoosterPackImage (setId) {
        const cards = await this.buildBoosterPack(setId);
        const boosterId = this.getBoosterId(cards);
        const urls = cards.map(card => card.image_uris.png);

        let stream = ImageMagick.montage(urls);
        stream = ImageMagick.compress(stream);
        imageCache[boosterId] = nodeUtils.processStream(stream);

        return {
            id: boosterId,
            image: {
                url: null,
                width: 5,
                height: Math.ceil(cards.length / 5),
                number: cards.length
            },
            cards
        };
    }

    static async buildBoosterPack(setId) {
        const allSets = await Scryfall.getSets();
        const structure = config.boosterStructure(setId, allSets);
        const set = await new MtgSet(setId);

        return structure
            .map(type => set.pullCard(type))
            .filter(v => v); // Filter out non-truthy values.
    }
}

module.exports = BoostersApi;
