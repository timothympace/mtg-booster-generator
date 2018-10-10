const Scryfall = require('../scryfall/api');

class Sets {
    constructor() {
        this.sets = {};
    }

    async init() {
        const data = await Scryfall.getSets();
        data.forEach((set) => {
            this.sets[set.code] = set;
        });

        return this;
    }

    get(setCode) {
        return this.sets[setCode];
    }

    getChildSets(setId) {
        return this.all().filter(set => set.parent_set_code === setId);
    }

    all() {
        return Object.values(this.sets);
    }
}

const sets = new Sets();



module.exports = sets;
