const crypto = require('crypto');

const Scryfall = require('../scryfall/api');
const ImageMagick = require('../utils/ImageMagick');
const nodeUtils = require('../utils/nodeUtils');
const config = require('./config');

const boostersCache = {};

class BoostersApi {
    static async getCachedBooster(id) {
        return boostersCache[id];
    }
    
    static getBoosterId(booster) {
        return crypto.createHash('sha256')
            .update(booster.map(card => card.id).join(''))
            .digest('hex');
    }
    
    static async buildBooster (setId) {
        const allCards = await Scryfall.getAllCardsInSet(setId);
        const booster = this.buildBoosterPack(setId, allCards);
        const boosterId = this.getBoosterId(booster);
        const urls = booster.map(card => card.image_uris.png);

        let stream = ImageMagick.montage(urls);
        stream = ImageMagick.compress(stream);
        boostersCache[boosterId] = nodeUtils.processStream(stream);

        return {
            id: boosterId,
            image: {
                url: null,
                width: 5,
                height: Math.ceil(booster.length / 5),
                number: booster.length
            },
            booster
        };
    }

    static buildBoosterPack(setId, cards) {
        const structure = config.boosterStructure(setId);

        // Filter out the basic lands
        const nonLandCards = cards.filter(card => card.type_line.indexOf('Basic Land') === -1);

        const all = {
            [config.RARITY.COMMON]:
                nonLandCards.filter(card => card.rarity === 'common'),
            [config.RARITY.UNCOMMON]:
                nonLandCards.filter(card => card.rarity === 'uncommon'),
            [config.RARITY.RARE]:
                nonLandCards.filter(card => card.rarity === 'rare'),
            [config.RARITY.MYTHIC]:
                nonLandCards.filter(card => card.rarity === 'mythic'),
            [config.CARD_TYPE.BASIC_LAND]:
                cards.filter(card => card.type_line.indexOf('Basic Land') !== -1)
        };

        return structure.map(type => {
            const choices = all[type];
            return choices[Math.floor(Math.random() * choices.length)];
        });
    }
}

module.exports = BoostersApi;
