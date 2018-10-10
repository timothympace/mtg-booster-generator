const express = require('express');

const Scryfall = require('./scryfall/api');
const boosterApi = require('./boosters/api');
const { errwait } = require('./utils/nodeUtils');
const sets = require('./boosters/Sets');
const app = express();
const port = 8080;

sets.init().then(() => {
    console.log('Sets have been loaded!');
});

app.listen(port, function(){
    console.log('Node js Express js Tutorial');
});

app.get('/sets/', function(req, res) {
    const all = sets.all().filter(set => set.set_type === 'core' || set.set_type === 'expansion');
    res.send(all);
});

app.get('/sets/:setId/all', async function (req, res) {
    const allCards = await Scryfall.getAllCardsInSet(req.params.setId);
    res.send(allCards);
});

app.get('/sets/:setId/booster', async function (req, res) {
    const { setId } = req.params;
    const [data, err] = await errwait(boosterApi.buildBoosterPackImage(setId));
    if (err != null) {
        console.log(err);
    }

    data.image.url = `${req.protocol}://${req.get('host')}/images/${data.id}.jpg`;
    res.send(data);
});

app.get('/sets/:setId/lands', async function (req, res) {
    const { setId } = req.params;
    const [data, err] = await errwait(boosterApi.buildLandPackImage(setId));
    if (err != null) {
        console.log(err);
    }

    data.image.url = `${req.protocol}://${req.get('host')}/images/${data.id}.jpg`;
    res.send(data);
});

app.get('/images/:id.jpg', async function (req, res) {
    const { id } = req.params;
    const boosterJpg = await boosterApi.getCachedBooster(id);

    if (!boosterJpg) {
        res.status(404).send(`Image[${id}] does not exist.`);
        return;
    }

    res.status(200);
    res.set('Content-Type', 'image/jpeg');
    res.send(boosterJpg);
});

