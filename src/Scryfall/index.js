const fetch = require('node-fetch');
const { errwait } = require('../utils');

class Scryfall {
    static async consume(uri) {
        let json = { has_more: true };
        let data = [];

        while (json.has_more) {
            const response = await fetch(uri);
            json = await response.json();

            data = data.concat(json.data);

            uri = json.next_page;
        }

        return data;
    }

    static async getSet(setId) {
        const setUrl = `https://api.scryfall.com/sets/${setId}`;
        const [response, err] = await errwait(fetch(setUrl));

        if (err != null) {
            return err;
        }

        const { search_uri: searchUri } = await response.json();
        return await this.consume(searchUri);
    }

    static async getSets() {
        const { data } = require('../Boosters/sets.json');
        return data;
    }

    static async getSets2() {
        return await this.consume('https://api.scryfall.com/sets/');
    }
}

module.exports = Scryfall;
