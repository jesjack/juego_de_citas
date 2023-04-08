import {gen_guid} from "./guid";
import {dialog_options, simple_dialog} from "./simple_dialog";

const fs = window.require('fs');
const path = window.require('path');

export interface character_say_options extends Omit<dialog_options, 'message'> {
    checkVisibility?: boolean;
}

export interface character_options {
    name: string;
    sprite: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
}

export class Character {
    private id: string;
    public name: string;
    private x?: number;
    private y?: number;
    private top?: number;
    private left?: number;
    private bottom?: number;
    private right?: number;
    private width: number;
    private height: number;
    private base64Sprite: string;
    constructor(options: character_options) {
        // {
        //             name = 'Character',
        //             sprite = '',
        //             width = 0,
        //             height = 0,
        //             x = undefined as number | undefined,
        //             y = undefined as number | undefined,
        //             top = undefined as number | undefined,
        //             left = undefined as number | undefined,
        //             bottom = undefined as number | undefined,
        //             right = undefined as number | undefined,
        //         } = {}) {

        this.id = 'i' + gen_guid();
        this.name = options.name;
        this.x = options.x;
        this.y = options.y;
        this.top = options.top;
        this.left = options.left;
        this.bottom = options.bottom;
        this.right = options.right;
        this.width = options.width;
        this.height = options.height;

        let sprite = options.sprite;
        if (sprite.startsWith('/')) {
            sprite = sprite.substring(1);
        }
        sprite = path.resolve('./assets/images/', sprite);
        if (fs.existsSync(sprite)) {
            this.base64Sprite = fs.readFileSync(sprite, {encoding: 'base64'});
        } else {
            console.log(`File ${sprite} does not exists`);
        }
    }
    setVisible(visible: boolean) {
        if (!visible) {
            const character = document.getElementById(this.id);
            if (character) {
                character.remove();
            }
            return;
        }

        if (document.getElementById(this.id))
            return;

        const game = document.getElementById('game');
        const character = document.createElement('div');
        character.id = this.id;
        character.classList.add('character');
        if (this.left === undefined || this.right === undefined)
            character.style.width = this.width + 'px';
        if (this.top === undefined || this.bottom === undefined)
            character.style.height = `${this.height}px`;
        character.style.backgroundImage = `url(data:image/jpeg;base64,${this.base64Sprite})`;
        character.style.backgroundSize = '100% 100%';
        character.style.backgroundRepeat = 'no-repeat';
        character.style.backgroundPosition = 'center';

        character.style.position = 'absolute';
        if (this.x !== undefined)
            character.style.left = this.x + 'px';
        if (this.y !== undefined)
            character.style.top = this.y + 'px';
        if (this.top !== undefined)
            character.style.top = this.top + 'px';
        if (this.left !== undefined)
            character.style.left = this.left + 'px';
        if (this.bottom !== undefined)
            character.style.bottom = this.bottom + 'px';
        if (this.right !== undefined)
            character.style.right = this.right + 'px';

        const dialog = document.getElementById('dialog');
        game.insertBefore(character, dialog);
    }

    say(text: string, options: character_say_options = { checkVisibility: true }) {
        if (options.checkVisibility)
            this.setVisible(true);
        return simple_dialog({
            ...options,
            title: this.name,
            message: text,
        })
    }
}