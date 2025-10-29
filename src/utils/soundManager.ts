import { UI_CONSTANTS } from "../constants/uiConstants";

// Sound utility for speech recognition feedback
export class SoundManager {
  private correctSound: HTMLAudioElement | null = null;
  private incorrectSound: HTMLAudioElement | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Create simple tone sounds using the Web Audio API
    this.correctSound = this.generateTone(
      UI_CONSTANTS.SOUND.CORRECT_TONE_FREQ, 
      UI_CONSTANTS.SOUND.TONE_DURATION
    ); // A5 note for correct
    this.incorrectSound = this.generateTone(
      UI_CONSTANTS.SOUND.INCORRECT_TONE_FREQ, 
      UI_CONSTANTS.SOUND.TONE_DURATION
    ); // A4 note for incorrect
  }

  private generateTone(frequency: number, duration: number): HTMLAudioElement {
    // Create a simple Web Audio API context to generate tones
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1;

    // Schedule the sound
    const startTime = audioContext.currentTime;
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    // Create an Audio element for React compatibility
    const audio = new Audio();
    return audio;
  }

  public playCorrectSound(): void {
    if (this.isMuted || !this.correctSound) return;
    
    // For simplicity, we'll use Web Audio API directly
    this.playTone(880, 0.3);
  }

  public playIncorrectSound(): void {
    if (this.isMuted || !this.incorrectSound) return;
    
    this.playTone(440, 0.3);
  }

  private playTone(frequency: number, duration: number): void {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1;

    const startTime = audioContext.currentTime;
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    // Apply a simple fade out to avoid clicking
    gainNode.gain.setValueAtTime(0.1, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }
}

// Singleton instance
export const soundManager = new SoundManager();