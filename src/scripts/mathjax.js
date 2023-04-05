// eslint-disable-next-line @typescript-eslint/no-var-requires
const mjAPI = require('mathjax-node');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { argv } = require('process');

const format = argv.includes('--inline') ? 'inline-TeX' : 'TeX';
const math = argv.includes('--equation') ? argv[argv.indexOf('--equation') + 1] : 'E = mc^2';
const mml = true;

async function renderMath() {
    const result = await mjAPI.typeset({ math, format, mml });
    console.log(result['mml']);
}

renderMath();
