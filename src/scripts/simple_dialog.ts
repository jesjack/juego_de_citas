import {slow_parser, text_format} from "./latex_math";
import {sleep} from "./time";

export interface dialog_options {
    title?: string;
    message: string;
    buttons?: string[];
    input?: boolean;
}

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
export async function simple_dialog(opts: dialog_options): Promise<{ button: string, value: string } | string | void> {
    const dialog_message = document.getElementById('dialog_message');
    const [ message, indexes, eq ] = text_format(opts.message);
    const title = opts.title ?? 'System';
    const buttons = opts.buttons ?? [];
    const input = opts.input ?? false;

    document.getElementById('dialog_title').innerText = title;
    dialog_message.innerHTML = '';
    keydowns.splice(0, keydowns.length);

    const paragraphs = message.split('\n');
    let i = 0;

    /**
     * Test if the current index is in the indexes array, if so, then parse the equation.
     * @param p the paragraph element
     * @param not_skip if not_skip is true, then the parser will not skip the sleep time.
     */
    const test_equation = async (p: HTMLParagraphElement, not_skip = true) => {
        if (indexes.some((index) => index === (i))) {
            const eq_ = await eq();
            await slow_parser(eq_, p, keydowns, not_skip);
            // remove the min index
            indexes.splice(indexes.indexOf(Math.min(...indexes)), 1);
            i++;
        }
    };

    for (const paragraph of paragraphs) {
        const p = document.createElement('p');
        dialog_message.appendChild(p);

        await test_equation(p);

        for (const letter of paragraph) {
            await sleep(!keydowns.includes(' ')  && 50);
            const lastChild = p.lastChild;
            if (lastChild instanceof Text)
                lastChild.textContent += letter;
            else
                p.appendChild(document.createTextNode(letter));

            i++;
            await test_equation(p, false);
        }

        while (keydowns.includes(' '))
            keydowns.splice(keydowns.indexOf(' '), 1);

        i++;
    }

    if (buttons.length === 0 && !input) {
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

    if (input) {
        const input_element = document.createElement('input');
        input_element.type = 'text';
        input_element.classList.add('input');
        dialog_message.appendChild(input_element);
        input_element.focus();
    }

    const buttons_container = document.createElement('div');
    buttons_container.classList.add('buttons');
    dialog_message.appendChild(buttons_container);
    for (const button of buttons) {
        const button_element = document.createElement('button');
        button_element.innerText = button;
        buttons_container.appendChild(button_element);
    }

    return new Promise<{ button: string, value: string } | string>((resolve) => {
        const buttons_elements = buttons_container.querySelectorAll('button');
        for (let i = 0; i < buttons_elements.length; i++) {
            const button_element = buttons_elements[i];
            button_element.addEventListener('click', () => {
                const input_element = dialog_message.querySelector('input');
                resolve(input_element ? {button: button_element.innerText, value: input_element.value} : button_element.innerText);
            });
        }

        const input_element = dialog_message.querySelector('input');
        input_element?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter')
                resolve(buttons.length > 0 ? {button: 'Enter', value: input_element.value} : input_element.value);
        });
    });
}