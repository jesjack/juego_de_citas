const child_process = window.require('child_process');
const path = window.require('path');

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    console.log(command);
    const latex_res = child_process.execSync(command).toString();
    const doc = parser.parseFromString(latex_res, 'text/xml');
    return doc.documentElement;
}

/**
 * Check if string is plain text or html parsable.
 * @param str
 */
function is_plain_text(str: string): boolean {
    return !str.startsWith('<') || !str.endsWith('>');
}

/**
 * This is a slow parser that pass the source element to the target element recursively with 200ms on each sub element.
 * @param src source element
 * @param target target element
 */
export async function slow_parser(src: HTMLElement, target: HTMLElement) {
    const copy = src.cloneNode(false) as HTMLElement;
    await sleep(50);
    target.appendChild(copy);
    // console.log(src.innerHTML)
    if (is_plain_text(src.innerHTML.trim())) {
        copy.innerHTML = src.innerHTML;
    } else for (let i = 0; i < src.children.length; i++) {
        await slow_parser(src.children[i] as HTMLElement, copy);
    }
}

const html = latex_html('$$\\int_{a}^{b} f(x) dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i) \\Delta x$$');
const game = document.getElementById('game');

slow_parser(html, game);