/**
 * Split message into paragraphs (\n to <p>content</p>) and display them in a dialog.
 */
export async function simple_dialog({
                                           title = 'System',
                                           message = '',
                                       } = {}): Promise<string | void> {
    document.getElementById('dialog_title').innerText = title;
    const dialog_message = document.getElementById('dialog_message');
    dialog_message.innerHTML = '';
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
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 50);
        });
    }

    return Promise.resolve();
}