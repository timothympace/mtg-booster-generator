const config = require('./config');
const sets = require('./Sets');
const Scryfall = require('../Scryfall');

class MtgSet {
    constructor(setId) {
        this.cards = {};
        Object.values(config.PULL_TYPES)
            .forEach(pullType => this.cards[pullType] = []);

        return (async () => {
            const cards = await Scryfall.getSet(setId);
            cards.forEach(card => {
                if (card.type_line.indexOf('Basic Land') !== -1) {
                    this.cards[config.PULL_TYPES.BASIC_LAND].push(card);
                }
                else if (card.rarity === 'common') {
                    this.cards[config.PULL_TYPES.COMMON].push(card);
                }
                else if (card.rarity === 'uncommon') {
                    this.cards[config.PULL_TYPES.UNCOMMON].push(card);
                }
                else if (card.rarity === 'rare') {
                    this.cards[config.PULL_TYPES.RARE].push(card);
                }
                else if (card.rarity === 'mythic') {
                    this.cards[config.PULL_TYPES.MYTHIC].push(card);
                }
            });

            await Promise.all(sets.getChildSets(setId).map(async set => {
                if (set.set_type === 'token') {
                    const tokens = await Scryfall.getSet(set.code);
                    this.cards[config.PULL_TYPES.MARKETING].push(...tokens);
                }
            }));

            return this;
        })();
    }

    pullCard(pullType = config.PULL_TYPES.COMMON) {
        const cards = this.cards[pullType];
        return cards && cards[Math.floor(Math.random() * cards.length)];
    }

    all(pullType) {
        if (pullType) {
            return this.cards[pullType];
        }

        return Object.values(this.cards).reduce((acc, curr) => acc.concat(curr), []);
    }
}

module.exports = MtgSet;
