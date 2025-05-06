import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 15;
const SLOWDOWN_RATE = 0.95;

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;

    constructor(symbolCount: number, symbolSize: number) {
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

        this.container = new PIXI.Container();
        this.symbols = [];

        this.createSymbols();
    }

    private createSymbols(): void {
        for (let i = 0; i < this.symbolCount + 1; i++) {
            const symbol = this.createRandomSymbol();
            symbol.x = i * this.symbolSize;
            symbol.y = 0;
            this.symbols.push(symbol);
            this.container.addChild(symbol);
        }
    }

    private createRandomSymbol(): PIXI.Sprite {
        const textureName = SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];
        const texture = AssetLoader.getTexture(textureName);
        const sprite = new PIXI.Sprite(texture);
        sprite.width = this.symbolSize;
        sprite.height = this.symbolSize;
        return sprite;
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        const moveX = this.speed * delta;

        for (const symbol of this.symbols) {
            symbol.x -= moveX;
        }

        // Recycle symbols that move off-screen to the left
        const firstSymbol = this.symbols[0];
        if (firstSymbol.x + this.symbolSize < 0) {
            const lastSymbol = this.symbols[this.symbols.length - 1];
            firstSymbol.x = lastSymbol.x + this.symbolSize;
            this.randomizeSymbolTexture(firstSymbol);

            // Move first symbol to end of array
            this.symbols.push(this.symbols.shift()!);
        }

        // Slow down if stopping
        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;
            if (this.speed < 0.5) {
                this.speed = 0;
                this.snapToGrid();
            }
        }
    }

    private snapToGrid(): void {
        const firstX = this.symbols[0].x;
        const offset = firstX % this.symbolSize;

        for (const symbol of this.symbols) {
            symbol.x -= offset;
        }
    }

    private randomizeSymbolTexture(symbol: PIXI.Sprite): void {
        const textureName = SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];
        symbol.texture = AssetLoader.getTexture(textureName);
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
    }

    public stopSpin(): void {
        this.isSpinning = false;
    }
}
