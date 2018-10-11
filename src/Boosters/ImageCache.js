const cache = {};

class ImageCache {
    static async get(id) {
        return cache[id];
    }

    static put(id, data) {
        cache[id] = data;
    }
}

module.exports = ImageCache;
