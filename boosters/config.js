const CARD_TYPE = {
    MARKETING: 'Marketing',
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

/**
 * Arabian Nights was sold in 8-card booster packs for
 * $1.45US per pack. Antiquities was also sold in 8-card
 * booster packs. Each pack contained:
 *
 * 6 commons and 2 uncommons (there were no rares).
 */
sets['arn'] =
sets['atq'] = [
    ...cardSlots(6, cardPull(RARITY.COMMON)),
    ...cardSlots(2, cardPull(RARITY.UNCOMMON))
];

/**
 * Legends booster packs contain 15 cards.
 *
 * 11 commons, 3 uncommons and 1 rare.
 */
sets['leg'] = [
    ...cardSlots(11, cardPull(RARITY.COMMON)),
    ...cardSlots(3, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

/**
 * The Dark, Fallen Empires and Homelands boosters contain 8 cards;
 * At least for Homelands, each pack contains 6 commons, and has
 * 2 slots that can be either uncommon or rare. This makes a
 * double rare or no rare pack possible. The ratio for each slot
 * is roughly 2/3 for an uncommon, 1/3 for a rare.
 */
sets['drk'] =
sets['fem'] =
sets['hml'] = [
    ...cardSlots(6, cardPull(RARITY.COMMON)),
    ...cardSlots(2, cardPull(RARITY.UNCOMMON, 2/3), cardPull(RARITY.RARE, 1/3))
];

/**
 * Alliances and Chronicles booster packs contain 12 cards:
 *
 * 8 commons, 3 uncommons and 1 rare.
 */
sets['all'] =
sets['chr'] = [
    ...cardSlots(8, cardPull(RARITY.COMMON)),
    ...cardSlots(3, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

/**
 * From Mirage until Coldsnap, booster packs contain 15 cards:
 *
 * 11 commons, 3 uncommons and 1 rare.
 */
sets['abcdefg'] = [
    ...cardSlots(11, cardPull(RARITY.COMMON)),
    ...cardSlots(3, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

/**
 * Unglued boosters contain 10 cards:
 *
 * 1 land card, 6 commons, 2 uncommons and 1 rare.
 */
sets['ugl'] = [
    cardSlot(cardPull(CARD_TYPE.BASIC_LAND)),
    ...cardSlots(6, cardPull(RARITY.COMMON)),
    ...cardSlots(2, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

/**
 * In core set booster packs from Seventh Edition to Ninth Edition
 * 1 common was replaced with a basic land card. These boosters
 * contain 15 cards:
 *
 * 1 basic land, 10 commons, 3 uncommons and 1 rare.
 */
sets['7ed'] =
sets['8ed'] =
sets['9ed'] = [
    cardSlot(cardPull(CARD_TYPE.BASIC_LAND)),
    ...cardSlots(10, cardPull(RARITY.COMMON)),
    ...cardSlots(3, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

/**
 * The Time Spiral block has "timeshifted" cards and due to this
 * their rarities in booster packs are different, though each
 * booster pack contains 15 cards.
 *
 * Time Spiral booster packs contain:
 * 10 commons, 3 uncommons, 1 rare, and 1 purple-rarity timeshifted card (found in the Timeshifted expansion)
 *
 * Planar Chaos booster packs contain:
 * 8 commons, 2 uncommons, 1 rare, 3 timeshifted commons, and 1 uncommon or rare timeshifted card.
 *
 * Future Sight booster packs contain:
 * 11 commons, 3 uncommons, and 1 rare, any of which might be a timeshifted card.
 */
//TBD

/**
 * Tenth Edition booster packs introduced an additional marketing
 * card and thus contain 16 cards:
 *
 * 1 marketing card, 1 basic land, 10 commons, 3 uncommons and 1 rare.
 */
sets['10e'] = [
    cardSlot(cardPull(CARD_TYPE.BASIC_LAND)),
    ...cardSlots(10, cardPull(RARITY.COMMON)),
    ...cardSlots(3, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

/**
 * From Lorwyn to Eventide, booster packs contain 16 cards:
 * 1 marketing card, 11 commons, 3 uncommons and 1 rare.
 */
sets['lorevt'] = [
    ...cardSlots(11, cardPull(RARITY.COMMON)),
    ...cardSlots(3, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE))
];

/**
 * From Shards of Alara on, both core set and expansion booster
 * packs contain 16 cards:
 *
 * 1 marketing card, 1 basic land, 10 commons (one maybe premium card in any rarity),
 * 3 uncommons and 1 rare (occasionally, about 1 in 8 packs, replaced by a mythic rare).
 *
 * However, some of the sets may contain different configurations on particular cards (see below).
 */
sets['shardson'] = [
    cardSlot(cardPull(CARD_TYPE.BASIC_LAND)),
    cardSlot(cardPull(RARITY.COMMON, 3/4), cardPull(CARD_TYPE.MARKETING, 1/4)),
    ...cardSlots(9, cardPull(RARITY.COMMON)),
    ...cardSlots(3, cardPull(RARITY.UNCOMMON)),
    cardSlot(cardPull(RARITY.RARE, 7/8), cardPull(RARITY.MYTHIC, 1/8))
];

function boosterStructure(setId) {
    return (sets[setId] || sets['shardson']).map(slot => {
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
