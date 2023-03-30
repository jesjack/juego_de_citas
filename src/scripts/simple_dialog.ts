export function simple_dialog({
    title = 'System',
    message = '',
    element = document.getElementById('dialog_message'),
} = {}): Promise<string | void> {
    document.getElementById('dialog_title').innerText = title;
    const dialog_message = element;
    dialog_message.innerText = '';
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const dialog_length = dialog_message.innerText.length;
            if (dialog_length !== message.length) {
                dialog_message.innerText += message[dialog_length];
            } else {
                clearInterval(interval);
                resolve();
            }
        }, 50);
    });
}

// /**
//  * Split message into paragraphs (\n to <p>content</p>) and display them in a dialog.
//  */
// export function paragraph_dialog({
//     title = 'System',
//     message = '',
// } = {}): Promise<string | void> {
//     document.getElementById('dialog_title').innerText = title;
//     const dialog_message = document.getElementById('dialog_message');
//     dialog_message.innerText = '';
//     const paragraphs = message.split('\n');
//     return new Promise((resolve) => {
//         for (const paragraph of paragraphs) {
//             const p = document.createElement('p');
//             await simple_dialog({
//                 title: title,
//                 message: paragraph,
//             }
//             dialog_message.appendChild(p);
//         }
//     });
// }