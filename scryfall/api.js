const fetch = require('node-fetch');
const { errwait } = require('../utils/nodeUtils');

let setsCache;

class Scryfall {
    static async getAllCardsInSet(setId) {
        let [response, err] = await errwait(fetch(this.mtgSetUrl(setId)));

        if (err != null) {
            return err;
        }

        let { search_uri: searchUri } = await response.json();
        let results = { has_more: true };
        let allCards = [];

        while (results.has_more) {
            response = await fetch(searchUri);
            results = await response.json();

            allCards = allCards.concat(results.data);

            searchUri = results.next_page;
        }

        return allCards;
    }

    static async getSets() {
        const { data } = require('../boosters/sets.json');
        return data;
    }

    static async getSets2() {
        const response = await fetch('https://api.scryfall.com/sets/');
        const { data } = await response.json();
        return data;
    }

    static async getMtgSet(setId) {
        const response = await fetch(this.mtgSetUrl(setId));
        return await response.json();
    }

    static mtgSetUrl(setId) {
        return `https://api.scryfall.com/sets/${setId}`;
    }
}

module.exports = Scryfall;
