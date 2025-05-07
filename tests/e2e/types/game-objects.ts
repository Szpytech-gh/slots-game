// Define the symbol type
export interface Symbol {
    x: number;
    y: number;
    texture: {
        textureCacheIds: string[];
    };
    width: number;
    height: number;
}

// Define the reel type
export interface Reel {
    isSpinning: boolean;
    speed: number;
    symbols: Symbol[];
    container: any;
}

// Define the slot machine type
export interface SlotMachine {
    isSpinning: boolean;
    reels: Reel[];
    spinButton: any;
    container: any;
    spin: () => void;
}

// Define the UI type
export interface UI {
    spinButton: any;
    container: any;
}

// Define the app type
export interface GameApp {
    screen: {
        width: number;
        height: number;
    };
    stage: {
        scale: {
            x: number;
            y: number;
        };
        position: {
            x: number;
            y: number;
        };
    };
    renderer: any;
}

// Define the game type
export interface Game {
    getApp: () => GameApp;
    getSlotMachine: () => SlotMachine;
    getUI: () => UI;
    getAssetLoader: () => any;
}

// Define the full game objects structure
export interface GameObjects {
    game: Game;
    slotMachine: SlotMachine;
    ui: UI;
    assetLoader: any;
}

// Extend Window interface to include gameObjects
declare global {
    interface Window {
        gameObjects?: GameObjects;
    }
}
