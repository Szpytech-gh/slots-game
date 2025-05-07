import { ClientFunction, Selector } from 'testcafe';
import { ReelState, ButtonPosition } from '../types/test-types';
import { GameObjects, SlotMachine, Game } from '../types/game-objects';

// Get canvas element selector
export const getCanvasSelector = (): Selector => {
    return Selector('#game-container canvas');
};

// Helper to access game objects with proper typing
export const getGameObjects = ClientFunction(() => {
    return window.gameObjects as GameObjects | undefined;
});

// Helper to access slot machine with proper typing
export const getSlotMachine = ClientFunction(() => {
    return window.gameObjects?.slotMachine as SlotMachine | undefined;
});

// Helper to access game with proper typing
export const getGame = ClientFunction(() => {
    return window.gameObjects?.game as Game | undefined;
});

// Wait for game initialization
export const waitForGameInitialization = ClientFunction(() => {
    return new Promise((resolve) => {
        // Check if the game is initialized every 100ms
        const checkInterval = setInterval(() => {
            if (window && window.gameObjects) {
                clearInterval(checkInterval);
                resolve(true);
            }
        }, 100);
        
        // Safety timeout after 10 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
            resolve(false);
        }, 10000);
    });
});

// Get detailed state of all reels
export const getReelState = ClientFunction(() => {
    const slotMachine = window.gameObjects?.slotMachine;
    if (!slotMachine) return [];
    
    return slotMachine.reels.map((reel, index) => {
        // Get detailed info about each reel
        return {
            index,
            isSpinning: reel.isSpinning,
            speed: reel.speed,
            symbols: reel.symbols.map(symbol => ({
                x: symbol.x,
                texture: symbol.texture.textureCacheIds[0] // Get the texture name
            }))
        };
    });
}) as () => Promise<ReelState[]>;

// Wait for spin to complete
export const waitForSpinToComplete = ClientFunction(() => {
    return new Promise((resolve) => {
        // Check if spinning has completed every 100ms
        const checkInterval = setInterval(() => {
            const slotMachine = window.gameObjects?.slotMachine;
            if (!slotMachine) {
                clearInterval(checkInterval);
                resolve(false);
                return;
            }
            
            // If all reels have stopped spinning and have zero speed
            if (slotMachine.reels.every(reel => !reel.isSpinning && reel.speed === 0)) {
                clearInterval(checkInterval);
                resolve(true);
            }
        }, 100);
        
        // Safety timeout after 10 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
            resolve(false);
        }, 10000);
    });
});

// Check if game is currently in spinning state
export const isGameSpinning = ClientFunction(() => {
    return window.gameObjects?.slotMachine?.isSpinning || false;
});

// Get position of the spin button
export const getSpinButtonPosition = ClientFunction(() => {
    const ui = window.gameObjects?.ui;
    const spinButton = ui?.spinButton;
    
    if (!spinButton) {
        return null;
    }
    
    // Get the global position of the button
    const globalPos = spinButton.getGlobalPosition();
    
    // Get the scale to convert from game coordinates to screen coordinates
    const app = window.gameObjects?.game.getApp();
    if (!app) return null;
    
    const scale = app.stage.scale.x;
    const width = Math.round(spinButton.width * scale);
    const height = Math.round(spinButton.height * scale);
    
    // Calculate positions and convert to integers
    return {
        offsetX: Math.round(globalPos.x * scale + width/2),
        offsetY: Math.round(globalPos.y * scale + height/2),
        width,
        height
    };
}) as () => Promise<ButtonPosition | null>;

// Compare symbol positions between two states
export const haveSymbolPositionsChanged = ClientFunction((initialState: ReelState[], finalState: ReelState[]) => {
    for (let i = 0; i < initialState.length; i++) {
        const initialSymbols = initialState[i].symbols;
        const finalSymbols = finalState[i].symbols;
        
        // Check if at least one symbol has changed position
        for (let j = 0; j < initialSymbols.length; j++) {
            if (Math.abs(initialSymbols[j].x - finalSymbols[j].x) > 0.1) {
                return true;
            }
        }
    }
    
    return false;
});