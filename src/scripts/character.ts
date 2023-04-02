import {gen_guid} from "./guid";

const fs = window.require('fs');
const path = window.require('path');

export class Character {
    private id: string;
    private name: string;
    private x?: number;
    private y?: number;
    private top?: number;
    private left?: number;
    private bottom?: number;
    private right?: number;
    private width: number;
    private height: number;
    private base64Sprite: string;
    constructor({
                    name = 'Character',
                    sprite = '',
                    width = 0,
                    height = 0,
                    x = undefined as number | undefined,
                    y = undefined as number | undefined,
                    top = undefined as number | undefined,
                    left = undefined as number | undefined,
                    bottom = undefined as number | undefined,
                    right = undefined as number | undefined,
                } = {}) {

        this.id = 'i' + gen_guid();
        this.name = name;
        this.x = x;
        this.y = y;
        this.top = top;
        this.left = left;
        this.bottom = bottom;
        this.right = right;
        this.width = width;
        this.height = height;

    //     if have sprite, then load it
        if (sprite) {
            if (sprite.startsWith('/')) {
                sprite = sprite.substring(1);
            }
            sprite = path.resolve('./', sprite);
            if (fs.existsSync(sprite)) {
                this.base64Sprite = fs.readFileSync(sprite, {encoding: 'base64'});
            } else {
                console.log(`File ${sprite} does not exists`);
            }
        }
    }
    setVisible(visible: boolean) {
        if (visible) {
            const game = document.getElementById('game');
            //     check if this character is not rendered
            if (!game.querySelector(`#${this.id}`)) {
                const character = document.createElement('div');
                character.id = this.id;
                character.classList.add('character');
                if (this.left === undefined || this.right === undefined)
                    character.style.width = `${this.width}px`;
                if (this.top === undefined || this.bottom === undefined)
                    character.style.height = `${this.height}px`;
                character.style.backgroundImage = `url(data:image/jpeg;base64,${this.base64Sprite})`;
                character.style.backgroundSize = '100% 100%';
                character.style.backgroundRepeat = 'no-repeat';
                character.style.backgroundPosition = 'center';

                character.style.position = 'absolute';
                character.style.left = `${this.x}px`;
                if (this.x !== undefined) {
                    character.style.left = `${this.x}px`;
                }
                if (this.y !== undefined) {
                    character.style.top = `${this.y}px`;
                }
                if (this.top !== undefined) {
                    character.style.top = `${this.top}px`;
                }
                if (this.left !== undefined) {
                    character.style.left = `${this.left}px`;
                }
                if (this.bottom !== undefined) {
                    character.style.bottom = `${this.bottom}px`;
                }
                if (this.right !== undefined) {
                    character.style.right = `${this.right}px`;
                }

                const dialog = document.getElementById('dialog');
                game.insertBefore(character, dialog);
            }
        } else {
            const character = document.getElementById(this.id);
            if (character) {
                character.remove();
            }
        }
    }
}