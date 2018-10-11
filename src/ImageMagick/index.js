const fetch = require('node-fetch');
const { spawn } = require('child_process');

class ImageMagick {
    static montage(urls) {
        const fds = urls.map((_, i) => `fd:${i+3}`);
        const stdios = urls.map(() => 'pipe');
        const stdio = ['pipe', 'pipe', 'pipe',  ...stdios];
        const args = [...fds, '-geometry', '+0+0', '-tile', '5x', '-'];

        const child = spawn('montage', args, { stdio });

        urls.map(async (url, i) => {
            const response = await fetch(url);
            response.body.pipe(child.stdio[i+3]);
        });

        return child.stdout;
    }

    static compress(input) {
        const stdio = ['pipe', 'pipe', 'pipe', 'pipe'];
        const args = ['-strip', '-interlace', 'Plane', '-gaussian-blur', '0.05', '-quality', '85%', 'fd:3', 'jpg:-'];
        const child = spawn('convert', args, { stdio });
        input.pipe(child.stdio[3]);
        return child.stdout;
    }
}

module.exports = ImageMagick;
