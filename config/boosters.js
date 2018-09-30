const CARD_TYPE = {
    BASIC_LAND: 'Basic Land',
    LAND: 'Land',
    CREATURE: 'Creature',
    LEGENDARY_CREATURE: 'Legendary Creature',
    INSTANT: 'Instant',
    SORCERY: 'Sorcery',
    PLANESWALKER: 'Legendary Planeswalker'
};

const RARITY = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    MYTHIC: 'mythic',
};

const cardPull = (type, probability = 1) => ({ type, probability });
const cardSlot = (...pulls) => ({ pulls });
const cardSlots = (num, ...args) => Array.from(Array(num)).map(() => cardSlot(...args));

const sets = {};
sets['arn'] =
sets['atq'] = [
    ...cardSlots(6, cardPull(RARITY.COMMON)),
    ...cardSlots(2, cardPull(RARITY.UNCOMMON))
];

sets['leg'] = [
    ...cardSlots(11, cardPull(RARITY.COMMON)),
    ...cardSlots(3, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

sets['drk'] =
sets['fem'] =
sets['hml'] = [
    ...cardSlots(6, cardPull(RARITY.COMMON)),
    ...cardSlots(2, cardPull(RARITY.UNCOMMON, 2/3), cardPull(RARITY.RARE, 1/3))
];

sets['all'] =
sets['chr'] = [
    ...cardSlots(8, cardPull(RARITY.COMMON)),
    ...cardSlots(3, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

// mirage -> coldsnap
sets['abcdefg'] = [
    ...cardSlots(11, cardPull(RARITY.COMMON)),
    ...cardSlots(3, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

// mirage -> coldsnap
sets['ugl'] = [
    cardSlot(cardPull(CARD_TYPE.BASIC_LAND)),
    ...cardSlots(6, cardPull(RARITY.COMMON)),
    ...cardSlots(2, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

function boosterStructure(setId) {
    return (sets[setId] || sets['abcdefg']).map(slot => {
        const sorted = slot.pulls.sort((a,b) => a.probability > b.probability);
        let random = Math.random();
        for (let i = 0; i < sorted.length; i++) {
            if (random > sorted[i].probability) {
                random -= sorted[i].probability;
                continue;
            }

            return sorted[i].type;
        }
    })
}

module.exports = {
    boosterStructure,
    CARD_TYPE,
    RARITY
};
