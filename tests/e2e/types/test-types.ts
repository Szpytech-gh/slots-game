// Type definitions for game state and helper functions

export interface ReelState {
    index: number;
    isSpinning: boolean;
    speed: number;
    symbols: {
        x: number;
        texture: string;
    }[];
}

export interface ButtonPosition {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
}

export interface GameInfo {
    screen: {
        width: number;
        height: number;
    };
    reelCount: number;
    isSpinning: boolean;
}
