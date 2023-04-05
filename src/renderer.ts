/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import {simple_dialog} from "./scripts/simple_dialog";
import {parse_background} from "./scripts/background";
import {Character} from "./scripts/character";

console.log('👋 This message is being logged by "renderer.js", included via webpack');


const character1 = new Character({
    name: 'Chica',
    sprite: '/assets/images/character.png',
    width: 150,
    bottom: 0,
    top: 50,
    x: 50,
})

async function main() {
    await simple_dialog({
        message: 'Hello, world!\nThis is a paragraph dialog.',
    });
    await character1.say('Hola humano, puedes resolver la siguiente ecuación?\n$$\\frac{1}{2}$$')
    const result = await simple_dialog({
        message: 'Hello, world!\nThis is a paragraph dialog.',
        input: true,
        // buttons: [ 'OK', 'Cancel' ],
    });
    parse_background('/assets/images/_81d84d12-b0c7-46d1-bf02-d68c5c34a5f4.jpeg');
    await simple_dialog({
        message: `You clicked ${JSON.stringify(result)}`,
    });
    character1.setVisible(false);
}

main().then(r => console.log('done', r));