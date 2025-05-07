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
    private targetStopPosition: number | null = null;
    private decelerationStarted: boolean = false;

    constructor(symbolCount: number, symbolSize: number) {
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

        this.container = new PIXI.Container();
        this.symbols = [];

        this.createSymbols();
    }

    private createSymbols(): void {
        for (let i = 0; i < this.symbolCount + 2; i++) {
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

        // Calculate movement for this frame
        const moveX = this.speed * delta;

        // Apply movement to all symbols
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

        // If we're stopping, manage the deceleration
        if (!this.isSpinning) {
            // When we first start to stop, calculate the target stop position
            if (!this.decelerationStarted) {
                this.calculateTargetStopPosition();
                this.decelerationStarted = true;
            }

            if (this.targetStopPosition !== null) {
                // Calculate distance to target
                const firstSymbolX = this.symbols[0].x;
                const distanceToTarget = this.calculateDistanceToTarget(firstSymbolX);
                
                // If we're very close to target, stop completely
                if (Math.abs(distanceToTarget) < 0.1) {
                    this.finalizeStop();
                    return;
                }
                
                // Dynamic deceleration based on distance to target
                this.adjustSpeedBasedOnTarget(distanceToTarget);
            } else {
                // Standard deceleration if no target is set
                this.speed *= SLOWDOWN_RATE;
                
                if (this.speed < 0.1) {
                    this.speed = 0;
                }
            }
        }
    }

    private calculateTargetStopPosition(): void {
        // Find the current first symbol's position
        const firstSymbolX = this.symbols[0].x;
        
        // Calculate how far it is from the next grid position
        const offset = firstSymbolX % this.symbolSize;
        
        // Calculate the distance to the next grid position
        // The target is to align the first symbol to a grid position
        const targetOffset = (offset > 0) ? offset : this.symbolSize + offset;
        
        // Store the target position
        this.targetStopPosition = firstSymbolX - targetOffset;
    }

    private calculateDistanceToTarget(currentPosition: number): number {
        if (this.targetStopPosition === null) return 0;
        
        // Calculate direct distance
        let distance = this.targetStopPosition - currentPosition;
        
        // Adjust for wrapping (if we've crossed the grid boundary)
        if (Math.abs(distance) > this.symbolSize * this.symbolCount) {
            distance = distance % (this.symbolSize * this.symbolCount);
        }
        
        return distance;
    }

    private adjustSpeedBasedOnTarget(distanceToTarget: number): void {
        // Calculate optimal deceleration based on distance
        // The closer we are to the target, the slower we should go
        const absDistance = Math.abs(distanceToTarget);
        
        if (absDistance < this.symbolSize * 0.5) {
            // Very close, slow down significantly
            this.speed = Math.max(0.1, absDistance * 0.05);
        } else if (absDistance < this.symbolSize) {
            // Somewhat close, slow down moderately
            this.speed = Math.max(0.5, absDistance * 0.1);
        } else {
            // Still far, use standard deceleration
            this.speed *= SLOWDOWN_RATE;
        }
    }

    private finalizeStop(): void {
        // Ensure we stop exactly at the target position
        if (this.targetStopPosition !== null) {
            const offset = this.symbols[0].x - this.targetStopPosition;
            
            if (Math.abs(offset) > 0.01) {
                for (const symbol of this.symbols) {
                    symbol.x -= offset;
                }
            }
        }
        
        // Reset state
        this.speed = 0;
        this.targetStopPosition = null;
        this.decelerationStarted = false;
    }

    private randomizeSymbolTexture(symbol: PIXI.Sprite): void {
        const textureName = SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];
        symbol.texture = AssetLoader.getTexture(textureName);
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
        this.targetStopPosition = null;
        this.decelerationStarted = false;
    }

    public stopSpin(): void {
        this.isSpinning = false;
    }
}
