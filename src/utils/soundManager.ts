import { UI_CONSTANTS } from "../constants/uiConstants";

// Sound utility for speech recognition feedback
export class SoundManager {
  private isMuted: boolean = false;
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize without creating audio context until first use
  }

  private createAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    
    try {
      // Create audio context only if it doesn't exist or is closed
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      return this.audioContext;
    } catch (error) {
      console.error('Error creating audio context:', error);
      return null;
    }
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
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = this.createAudioContext();
      if (!audioContext) {
        console.error('Unable to create audio context');
        return;
      }

      // Resume context if suspended (common with autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

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

      // Clean up after sound completes
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
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

  // Clean up the audio context
  public cleanup(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager();