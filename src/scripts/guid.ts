
function min_guid(): string {
    return Math.floor((Math.random()) * 0x10000)
        .toString(16)
}
export function gen_guid(): string {
    let guid = '';
    for (let i = 0; i < 8; i++) {
        guid += min_guid();
        if (i < 7) {
            guid += '-';
        }
    }
    return guid;
}
