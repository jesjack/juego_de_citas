/*
 * <div class="dialog">
 *         <span class="title" id="dialog_title">Sistema</span>
 *         <div class="text" id="dialog_message">Cargando dialogos...</div>
 *       </div>
 */

// add key press event listener to all page
const keydowns: string[] = [];
document.addEventListener('keydown', (event) => {
    if (!keydowns.includes(event.key)) {
        keydowns.push(event.key);
    }
});

/**
 * Split message into paragraphs (\n to <p>content</p>) and display them in a dialog.
 * Return a promise that resolves after the user press any button.
 * if does not exists buttons, then resolve with undefined on space press.
 *
 */
export async function simple_dialog({
                                         title = 'System',
                                         message = '',
                                         buttons = [] as string[],
                                        } = {}): Promise<string | void> {
    document.getElementById('dialog_title').innerText = title;
    const dialog_message = document.getElementById('dialog_message');
    dialog_message.innerHTML = '';
    keydowns.splice(0, keydowns.length);
    const paragraphs = message.split('\n');
    for (let paragraph of paragraphs) {
        paragraph = paragraph.trim();
        const p = document.createElement('p');
        dialog_message.appendChild(p);
        await new Promise<void>((resolve) => {
            let accumulative = '';
            const interval = setInterval(() => {
                const dialog_length = p.innerText.length + accumulative.length;
                if (dialog_length !== paragraph.length) {
                    if (paragraph[dialog_length] === ' ') {
                        accumulative += ' ';
                    } else {
                        p.innerText += accumulative + paragraph[dialog_length];
                        accumulative = '';
                    }

                    // if space pressed, then add all text
                    if (keydowns.includes(' ')) {
                        p.innerText += accumulative + paragraph.substring(dialog_length + 1);
                        clearInterval(interval);
                        keydowns.splice(keydowns.indexOf(' '), 1);
                        resolve();
                    }
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 50);
        });
    }

    if (buttons.length === 0) {
        return new Promise<void>((resolve) => {
            const interval = setInterval(() => {
                if (keydowns.includes(' ')) {
                    clearInterval(interval);
                    keydowns.splice(keydowns.indexOf(' '), 1);
                    dialog_message.innerHTML = '';
                    resolve();
                }
            }, 50);
        });
    }

    const buttons_container = document.createElement('div');
    buttons_container.classList.add('buttons');
    dialog_message.appendChild(buttons_container);
    return new Promise<string>((resolve) => {
        for (const button of buttons) {
            const button_element = document.createElement('button');
            button_element.innerText = button;
            buttons_container.appendChild(button_element);
            button_element.addEventListener('click', () => {
                dialog_message.innerHTML = '';
                resolve(button);
            });
        }
    });
}