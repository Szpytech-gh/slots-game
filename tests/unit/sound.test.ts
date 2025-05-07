import { sound } from '../../src/utils/sound';

// Mock Howler
jest.mock('howler', () => {
  const mockPlay = jest.fn();
  const mockStop = jest.fn();
  
  return {
    Howl: jest.fn().mockImplementation(() => ({
      play: mockPlay,
      stop: mockStop,
    })),
    mockPlay,
    mockStop,
  };
});

// Get the mocked functions
const { mockPlay, mockStop } = require('howler');

describe('Sound Player', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should add a sound to the library', () => {
    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log');
    
    // Add a sound
    sound.add('test', 'test.mp3');
    
    // Check that console.log was called with the right message
    expect(consoleSpy).toHaveBeenCalledWith('Sound added: test from test.mp3');
    
    // Restore console.log
    consoleSpy.mockRestore();
  });

  test('should play a sound', () => {
    // Add a sound first
    sound.add('test', 'test.mp3');
    
    // Play the sound
    sound.play('test');
    
    // Verify that the play method was called
    expect(mockPlay).toHaveBeenCalled();
  });

  test('should stop a sound', () => {
    // Add a sound first
    sound.add('test', 'test.mp3');
    
    // Stop the sound
    sound.stop('test');
    
    // Verify that the stop method was called
    expect(mockStop).toHaveBeenCalled();
  });

  test('should log a warning when playing a non-existent sound', () => {
    // Spy on console.warn
    const consoleSpy = jest.spyOn(console, 'warn');
    
    // Try to play a sound that doesn't exist
    sound.play('nonexistent');
    
    // Check that console.warn was called with the right message
    expect(consoleSpy).toHaveBeenCalledWith('Sound not found: nonexistent');
    
    // Restore console.warn
    consoleSpy.mockRestore();
  });
});