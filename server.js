const fetch = require('node-fetch');
const express = require('express');
const imagemagick = require('imagemagick');
const fs = require('fs');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

app.listen(port, function(){
    console.log('Node js Express js Tutorial');
});

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/sets', function (req, res) {
    res.redirect('https://api.scryfall.com/sets/');
});

app.get('/sets/:setId', function (req, res) {
    res.redirect(mtgSetUrl(req.params.setId));
});

app.get('/sets/:setId/all', async function (req, res) {
    const allCards = await getAllCardsInSet(req.params.setId);
    res.send(allCards);
});

app.get('/sets/:setId/booster', async function (req, res) {
    const { setId } = req.params;
    const allCards = await getAllCardsInSet(setId);
    const booster = buildBooster(setId, allCards);
    const boosterCfgs = booster.map(card => {
        const id = card.id;
        const url = card.image_uris.png;
        const ext = path.extname(url.split('?')[0]);
        const filename = id + ext;
        const filepath = `/tmp/${filename}`;
        return { id, url, filepath };
    });

    await Promise.all(boosterCfgs.map(cfg => downloadFile(cfg.url, cfg.filepath)));
    const boosterId = crypto.createHash('sha256')
        .update(boosterCfgs.map(cfg => cfg.id).join(''))
        .digest('hex');

    const inputs = boosterCfgs.map(cfg => cfg.filepath);
    const output = `/tmp/${boosterId}.png`;
    console.log(inputs, output);
    await montage(inputs, output);

    res.sendFile(output);
});

async function montage(inputs, output) {
    return new Promise((resolve, reject) => {

        const cmd = `montage ${inputs.join(' ')} -geometry +0+0 ${output}`;

        exec(cmd, function(err) {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
}

function buildBooster(setId, cards) {
    const booster = [];

    // Filter out the basic lands
    cards = cards.filter(card => card.type_line.indexOf('Basic Land') === -1);

    // Pick a rare card.
    const rares = cards.filter(card => card.rarity === 'rare');
    booster.push(rares[Math.floor(Math.random() * rares.length)]);

    // One eight of the time, override the rare with a mythic.
    if (Math.random() < 1/8) {
        const mythics = cards.filter(card => card.rarity === 'mythic');
        booster[0] = mythics[Math.floor(Math.random() * mythics.length)];
    }

    // Pick 3 uncommon cards
    const uncommons = cards.filter(card => card.rarity === 'uncommon');
    for (let i = 0; i < 3; i++) {
        booster.push(uncommons[Math.floor(Math.random() * uncommons.length)]);
    }

    // Pick 11 common cards
    const commons = cards.filter(card => card.rarity === 'common');
    for (let i = 0; i < 12; i++) {
        booster.push(commons[Math.floor(Math.random() * commons.length)]);
    }

    return booster;
}

const mtgSetUrl = (setId) => `https://api.scryfall.com/sets/${setId}`;

const getMtgSet = async (setId) => {
    const response = await fetch(mtgSetUrl(setId));
    return await response.json();
};

async function downloadFile(url, dest) {
    const response = await fetch(url);
    const ws = fs.createWriteStream(dest);
    response.body.pipe(ws);

    return new Promise((resolve, reject) => {
        response.body.on('error', err => {
            reject(err);
        });
        ws.on('finish', () => {
            resolve();
        });
        ws.on('error', err => {
            reject(err);
        });
    })
}

async function getAllCardsInSet(setId) {
    let response = await fetch(mtgSetUrl(setId));
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

function generateMatchupLogo(sport, teamA, teamB, width, height) {
    return new Promise(function(resolve, reject) {

        var cmd = `scripts/matchup/matchup.sh -s ${sport} -a ${teamA} -b ${teamB} ${width} ${height} png:-`

        child_process.exec(cmd, {
            encoding: 'binary',
            maxBuffer: 1024 * 1024
        }, function(err, stdout) {
            if (err) {
                reject(err);
            }
            else {
                resolve(new Buffer(stdout, 'binary'));
            }
        });
    });
}

/*exports.getAllSets = async (req, res) => {
    const response = await fetch('https://api.scryfall.com/sets')
    const setsObj = await response.json()

    const fetchedSets = setsObj.data;
    const cachedSets = await getStoredMtgSets();

    const unique = {};
    cachedSets.forEach(set => unique[set.code] = set);

    for (var i = 0; i < fetchedSets.length; i++) {
        let set = fetchedSets[i];
        if (!unique[set.code]) {
            set = await getMtgSet(set.code);
            unique[set.code] = set;
            storeMtgSet(set);
        }
    }

    let sets = Object.values(unique);

    sets = sets.filter(set => set.set_type === 'core' || set.set_type === 'expansion');

    res.json(sets);
}*/