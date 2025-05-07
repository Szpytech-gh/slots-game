import { 
    getReelState, 
    waitForSpinToComplete, 
    isGameSpinning, 
    getSpinButtonPosition, 
    haveSymbolPositionsChanged,
    getCanvasSelector,
    waitForGameInitialization
} from './helpers/test-helpers';
import { ButtonPosition, ReelState } from './types/test-types';

// Declare variables to store state between hooks and tests
let canvas: Selector;
let initialState: ReelState[];
let buttonPos: ButtonPosition | null;

fixture`Slots Game Click Spin Tests`
    .beforeEach(async t => {
        const spinCompleted = await waitForGameInitialization();
        await t.expect(spinCompleted).ok('Game should initialize within timeout');
        // Get canvas element
        canvas = getCanvasSelector();
        await t.expect(canvas.exists).ok('Canvas element should exist');
        
        // Get initial state of all reels
        initialState = await getReelState();
        
        // Verify all reels are initialized and not spinning
        await t.expect(initialState.length).gt(0, 'Game should have reels');
        await t.expect(initialState.every(reel => !reel.isSpinning)).ok('All reels should be stopped initially');
    });

test('Spin button click test', async t => {

    // Get the position of the spin button
    buttonPos = await getSpinButtonPosition();
    await t.expect(buttonPos).ok('Spin button should exist and have a position');
    
    // 1. Click the spin button using canvas offsets
    if (buttonPos) {
        await t.click(canvas, {
            offsetX: buttonPos.offsetX,
            offsetY: buttonPos.offsetY
        });
    } else {
        throw new Error('Button position is null');
    }
    
    // 2. Wait a moment for the spin to start
    await t.wait(500);
    
    // 3. Verify the game is spinning
    const isSpinning = await isGameSpinning();
    await t.expect(isSpinning).ok('Game should be in spinning state after clicking the button');
    
    // 4. Wait for spin to complete
    const spinCompleted = await waitForSpinToComplete();
    await t.expect(spinCompleted).ok('Spin should complete within timeout');
    
    // 5. Get final state after spin
    const finalState = await getReelState();
    
    // 6. Verify all reels have stopped
    await t.expect(finalState.every(reel => !reel.isSpinning && reel.speed === 0))
        .ok('All reels should stop after spin');
    
    // 7. Verify symbols have changed position
    const positionsChanged = await haveSymbolPositionsChanged(initialState, finalState);
    await t.expect(positionsChanged).ok('Symbol positions should change after spin');
});
