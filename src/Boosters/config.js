const allSets = require('./Sets');

const PULL_TYPES = {
    MARKETING: 'pullTypes/marketing',
    PROMO: 'pullTypes/promo',
    BASIC_LAND: 'pullTypes/basicLand',
    COMMON: 'pullTypes/common',
    UNCOMMON: 'pullTypes/uncommon',
    RARE: 'pullTypes/rare',
    MYTHIC: 'pullTypes/mythic',
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
    ...cardSlots(6, cardPull(PULL_TYPES.COMMON)),
    ...cardSlots(2, cardPull(PULL_TYPES.UNCOMMON))
];

/**
 * Legends booster packs contain 15 cards.
 *
 * 11 commons, 3 uncommons and 1 rare.
 */
sets['leg'] = [
    ...cardSlots(11, cardPull(PULL_TYPES.COMMON)),
    ...cardSlots(3, cardPull(PULL_TYPES.UNCOMMON)),
    cardSlot(cardPull(PULL_TYPES.RARE))
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
    ...cardSlots(6, cardPull(PULL_TYPES.COMMON)),
    ...cardSlots(2, cardPull(PULL_TYPES.UNCOMMON, 2/3), cardPull(PULL_TYPES.RARE, 1/3))
];

/**
 * Alliances and Chronicles booster packs contain 12 cards:
 *
 * 8 commons, 3 uncommons and 1 rare.
 */
sets['all'] =
sets['chr'] = [
    ...cardSlots(8, cardPull(PULL_TYPES.COMMON)),
    ...cardSlots(3, cardPull(PULL_TYPES.UNCOMMON)),
    cardSlot(cardPull(PULL_TYPES.RARE))
];

/**
 * From Mirage until Coldsnap, booster packs contain 15 cards:
 *
 * 11 commons, 3 uncommons and 1 rare.
 */
sets['mir-csp'] = [
    ...cardSlots(11, cardPull(PULL_TYPES.COMMON)),
    ...cardSlots(3, cardPull(PULL_TYPES.UNCOMMON)),
    cardSlot(cardPull(PULL_TYPES.RARE))
];

/**
 * Unglued boosters contain 10 cards:
 *
 * 1 land card, 6 commons, 2 uncommons and 1 rare.
 */
sets['ugl'] = [
    cardSlot(cardPull(PULL_TYPES.BASIC_LAND)),
    ...cardSlots(6, cardPull(PULL_TYPES.COMMON)),
    ...cardSlots(2, cardPull(PULL_TYPES.UNCOMMON)),
    cardSlot(cardPull(PULL_TYPES.RARE))
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
    cardSlot(cardPull(PULL_TYPES.BASIC_LAND)),
    ...cardSlots(10, cardPull(PULL_TYPES.COMMON)),
    ...cardSlots(3, cardPull(PULL_TYPES.UNCOMMON)),
    cardSlot(cardPull(PULL_TYPES.RARE))
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
    cardSlot(cardPull(PULL_TYPES.MARKETING)),
    cardSlot(cardPull(PULL_TYPES.BASIC_LAND)),
    ...cardSlots(10, cardPull(PULL_TYPES.COMMON)),
    ...cardSlots(3, cardPull(PULL_TYPES.UNCOMMON)),
    cardSlot(cardPull(PULL_TYPES.RARE))
];

/**
 * From Lorwyn to Eventide, booster packs contain 16 cards:
 * 1 marketing card, 11 commons, 3 uncommons and 1 rare.
 */
sets['lrw-eve'] = [
    cardSlot(cardPull(PULL_TYPES.MARKETING)),
    ...cardSlots(11, cardPull(PULL_TYPES.COMMON)),
    ...cardSlots(3, cardPull(PULL_TYPES.UNCOMMON)),
    cardSlot(cardPull(PULL_TYPES.RARE))
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
sets['ala-'] = [
    cardSlot(cardPull(PULL_TYPES.MARKETING)),
    cardSlot(cardPull(PULL_TYPES.BASIC_LAND)),
    cardSlot(cardPull(PULL_TYPES.COMMON, 3/4), cardPull(PULL_TYPES.PROMO, 1/4)),
    ...cardSlots(9, cardPull(PULL_TYPES.COMMON)),
    ...cardSlots(3, cardPull(PULL_TYPES.UNCOMMON)),
    cardSlot(cardPull(PULL_TYPES.RARE, 7/8), cardPull(PULL_TYPES.MYTHIC, 1/8))
];

function boosterStructure(setId) {
    if (!(setId in sets)) {
        setId = Object.keys(sets).filter(k => k.includes('-')).find(idRange => {
            const [start, end] = idRange.split('-');
            const startDate = start ?
                Date.parse(allSets.get(start).released_at) :
                new Date(-8640000000000000);
            const endDate = end ?
                Date.parse(allSets.get(end).released_at) :
                new Date();
            const checkDate = Date.parse(allSets.get(setId).released_at);
            return startDate < checkDate && checkDate < endDate;
        });
    }

    return (sets[setId]).map(slot => {
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
    PULL_TYPES
};
