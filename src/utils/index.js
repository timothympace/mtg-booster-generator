class Utils {
    static processStream(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', chunk => {
                chunks.push(chunk);
            });
            stream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
        });
    }

    static errwait(promise) {
        return promise.then(data => {
            return [data];
        })
        .catch(err => [null, err]);
    }
}

module.exports = Utils;
