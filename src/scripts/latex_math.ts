import {sleep} from "./time";

const child_process = window.require('child_process');
const path = window.require('path');

function is_plain_text(str: string): boolean {
    return !str.startsWith('<') || !str.endsWith('>');
}

export function latex_html(text: string): HTMLElement {
    const parser = new DOMParser();
    const is_inline = text.startsWith('$') && text.endsWith('$');
    const is_block = text.startsWith('$$') && text.endsWith('$$'); // more important than is_inline
    if (!is_inline && !is_block) {
        throw new Error(`Invalid latex string: ${text}`);
    }

    const latex = text.substring(is_block ? 2 : 1, text.length - (is_block ? 2 : 1));
    const command = `node ${path.join('.', 'src', 'scripts', 'mathjax.js')} --equation "${latex}"` + (is_block ? '' : ' --inline');
    const latex_res = child_process.execSync(command).toString();
    const doc = parser.parseFromString(latex_res, 'text/xml');
    return doc.documentElement;
}

/**
 * This function removes all equations in the text and return a new [text with equations removed, indexes of equations, function to get the next equation]
 * aviable for $ and $$.
 * @param text
 */
export function text_format(text: string): [string, Array<number>, () => Promise<HTMLElement>] {
    const string_equations: Array<string> = [];
    const equations: Array<HTMLElement> = [];
    const new_text = text.replace(/\$\$.*?\$\$/g, '').replace(/\$.*?\$/g, '');
    const indexes: Array<number> = []; // the position of the each equation in the new text

    let resolved_equations = 0;
    let indexes_length = 0;
    /**
     * This function returns a promise that resolves to the next equation when the next equation is ready.
     */
    const equation_getter = () => {
        return new Promise<HTMLElement>((resolve, reject) => {
            if (resolved_equations >= indexes_length) {
                reject('No more equations');
                return;
            }

            const interval = setInterval(() => {
                if (equations.length > 0) {
                    resolved_equations++;
                    clearInterval(interval);
                    resolve(equations.shift());
                }
            }, 50);

            setTimeout(() => {
                reject('Timeout');
            }, 5000);
        });
    }

    let index = 0;
    let equation_index = 0;
    while (index < text.length) {
        if (text[index] === '$') {
            if (text[index + 1] === '$') {
                const string_equation = text.substring(index, text.indexOf('$$', index + 2) + 2);
                string_equations.push(string_equation);
                indexes.push(equation_index);
                index = text.indexOf('$$', index + 2) + 2;
                equation_index++;
            } else {
                const string_equation = text.substring(index, text.indexOf('$', index + 1) + 1);
                string_equations.push(string_equation);
                indexes.push(equation_index);
                index = text.indexOf('$', index + 1) + 1;
                equation_index++;
            }
        } else {
            index++;
            equation_index++;
        }
    }

    setTimeout(() => {
        string_equations.forEach((eq) => {
            equations.push(latex_html(eq));
        });
    }, 0);

    indexes_length = indexes.length;

    return [new_text, indexes, equation_getter];
}

/**
 * This is a slow parser that pass the source element to the target element recursively with 200ms on each sub element.
 * @param src source element
 * @param target target element
 * @param keydowns keydowns, if keydowns includes ' ', then the parser will skip the sleep time.
 * @param delete_keys
 */
export async function slow_parser(src: HTMLElement, target: HTMLElement, keydowns: string[] = [], delete_keys = true) {
    if (keydowns.includes(' ')) {
        target.appendChild(src);
        return;
    }

    const copy = src.cloneNode(false) as HTMLElement;
    await sleep(50);
    target.appendChild(copy);
    if (is_plain_text(src.innerHTML.trim())) {
        copy.innerHTML = src.innerHTML;
    } else for (let i = 0; i < src.children.length; i++) {
        await slow_parser(src.children[i] as HTMLElement, copy, keydowns, false);
    }
    if (delete_keys && keydowns.includes(' ')) {
        keydowns.splice(keydowns.indexOf(' '), 1);
    }
}