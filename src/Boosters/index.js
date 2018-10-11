const crypto = require('crypto');

const Scryfall = require('../Scryfall');
const ImageMagick = require('../ImageMagick');
const nodeUtils = require('../utils/index');
const config = require('./config');
const MtgSet = require('./MtgSet');
const ImageCache = require('./ImageCache');

const qualityMap = {
    0: 'small',
    1: 'normal',
    2: 'large',
    3: 'png'
};

class BoostersApi {
    static getCardsHash(cards) {
        return crypto.createHash('sha256')
            .update(cards.map(card => card.id).join(''))
            .digest('hex');
    }

    static async buildLandPackImage(setId, quality) {
        const set = await new MtgSet(setId);
        const cards = set.all(config.PULL_TYPES.BASIC_LAND);
        return this.buildCardSheet(cards, quality);
    }
    
    static async buildBoosterPackImage (setId, quality) {
        const cards = await this.buildBoosterPack(setId);
        return this.buildCardSheet(cards, quality);
    }

    static async buildCardSheet(cards, quality = 3) {
        const id = this.getCardsHash(cards);
        const imageType = qualityMap[quality];
        const urls = cards.map(card => card.image_uris[imageType]);

        let stream = ImageMagick.montage(urls);
        stream = ImageMagick.compress(stream);
        ImageCache.put(id, nodeUtils.processStream(stream));

        return {
            id,
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
