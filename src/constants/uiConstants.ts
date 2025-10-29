// UI Constants
export const UI_CONSTANTS = {
  FRUIT_ITEM_SIZE: {
    width: 100,
    height: 100
  },
  ANIMATION_DURATIONS: {
    SELECTION: 500, // ms
    FADE: 300 // ms
  },
  COLORS: {
    SELECTION_BORDER: '#ff0000',
    SELECTION_BG: '#ffe6e6',
    CORRECT_FEEDBACK: '#4CAF50',
    INCORRECT_FEEDBACK: '#f44336'
  },
  SOUND: {
    CORRECT_TONE_FREQ: 880, // Hz
    INCORRECT_TONE_FREQ: 440, // Hz
    TONE_DURATION: 0.3 // seconds
  }
} as const;