import * as PIXI from 'pixi.js';
import { SlotMachine } from './slots/SlotMachine';
import { AssetLoader } from './utils/AssetLoader';
import { UI } from './ui/UI';

// Declare global window interface for TypeScript
declare global {
    interface Window {
        gameObjects?: {
            game: Game;
            slotMachine: SlotMachine;
            assetLoader: AssetLoader;
            ui: UI;
        };
    }
}

export class Game {
    private app: PIXI.Application;
    private slotMachine!: SlotMachine;
    private ui!: UI;
    private assetLoader: AssetLoader;

    constructor() {
        this.app = new PIXI.Application({
            width: 1280,
            height: 800,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(this.app.view as HTMLCanvasElement);
        }

        this.assetLoader = new AssetLoader();

        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);

        window.addEventListener('resize', this.resize);

        this.resize();
    }

    public async init(): Promise<void> {
        try {
            await this.assetLoader.loadAssets();

            this.slotMachine = new SlotMachine(this.app);
            this.app.stage.addChild(this.slotMachine.container);

            this.ui = new UI(this.app, this.slotMachine);
            this.app.stage.addChild(this.ui.container);

            // In development mode, webpack sets NODE_ENV to 'development'
            if (process.env.NODE_ENV !== 'production') {
                // Expose game objects for testing in development mode
                window.gameObjects = {
                    game: this,
                    slotMachine: this.slotMachine,
                    assetLoader: this.assetLoader,
                    ui: this.ui
                };
                
                console.log('Game objects exposed for testing');
            }

            this.app.ticker.add(this.update.bind(this));

            console.log('Game initialized successfully');
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    }

    private update(delta: number): void {
        if (this.slotMachine) {
            this.slotMachine.update(delta);
        }
    }

    private resize(): void {
        if (!this.app || !this.app.renderer) return;

        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        const w = gameContainer.clientWidth;
        const h = gameContainer.clientHeight;

        // Calculate scale to fit the container while maintaining aspect ratio
        const scale = Math.min(w / 1280, h / 800);

        this.app.stage.scale.set(scale);

        // Center the stage
        this.app.renderer.resize(w, h);
        this.app.stage.position.set(w / 2, h / 2);
        this.app.stage.pivot.set(1280 / 2, 800 / 2);
    }
    
    // Public getters - these are part of the normal class API
    public getApp(): PIXI.Application {
        return this.app;
    }
    
    public getSlotMachine(): SlotMachine {
        return this.slotMachine;
    }
    
    public getUI(): UI {
        return this.ui;
    }
    
    public getAssetLoader(): AssetLoader {
        return this.assetLoader;
    }
}