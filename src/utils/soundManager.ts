import { UI_CONSTANTS } from "../constants/uiConstants";

// Sound utility for speech recognition feedback
export class SoundManager {
  private isMuted: boolean = false;

  constructor() {
    // Initialize without pre-creating sounds since we'll generate them on demand
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  public playCorrectSound(): void {
    if (this.isMuted) return;
    
    this.playTone(
      UI_CONSTANTS.SOUND.CORRECT_TONE_FREQ, 
      UI_CONSTANTS.SOUND.TONE_DURATION
    );
  }

  public playIncorrectSound(): void {
    if (this.isMuted) return;
    
    this.playTone(
      UI_CONSTANTS.SOUND.INCORRECT_TONE_FREQ, 
      UI_CONSTANTS.SOUND.TONE_DURATION
    );
  }

  private playTone(frequency: number, duration: number): void {
    // Check if we're in a browser context
    if (typeof window === 'undefined' || !window.AudioContext) return;
    
    try {
      // Create audio context on demand to comply with autoplay policies
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
      
      // Apply a simple fade out to avoid clicking
      gainNode.gain.setValueAtTime(0.1, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.stop(startTime + duration);
      
      // Resume context in case it's suspended (common with autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
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