const fs = window.require('fs');
const path = window.require('path');

/**
 * Take a image file and set it as the background, if it exists
 * @param file path to the image file
 */
export function parse_background(file: string) {
    // if file starts with /, remove it
    if (file.startsWith('/')) {
        file = file.substring(1);
    }

    file = path.resolve('./assets/images/', file);
    if (fs.existsSync(file)) {
        const base64 = fs.readFileSync(file, { encoding: 'base64' });
        // set background
        const game = document.getElementById('game');
        game.style.backgroundImage = `url(data:image/jpeg;base64,${base64})`;
        game.style.backgroundSize = 'cover';
        game.style.backgroundRepeat = 'no-repeat';
        game.style.backgroundPosition = 'center';
        game.style.backgroundAttachment = 'fixed';
    } else {
        console.log(`File ${file} does not exists`);
    }
}