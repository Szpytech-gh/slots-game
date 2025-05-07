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
    const consoleSpy = jest.spyOn(console, 'log');
    
    sound.add('test', 'test.mp3');
    
    expect(consoleSpy).toHaveBeenCalledWith('Sound added: test from test.mp3');
    
    consoleSpy.mockRestore();
  });

  test('should play a sound', () => {
    sound.add('test', 'test.mp3');
    
    sound.play('test');
    
    expect(mockPlay).toHaveBeenCalled();
  });

  test('should stop a sound', () => {
    sound.add('test', 'test.mp3');
    
    sound.stop('test');
    
    expect(mockStop).toHaveBeenCalled();
  });

  test('should log a warning when playing a non-existent sound', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    
    sound.play('nonexistent');
    
    expect(consoleSpy).toHaveBeenCalledWith('Sound not found: nonexistent');
    
    consoleSpy.mockRestore();
  });
});
