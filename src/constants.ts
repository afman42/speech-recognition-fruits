// Speech Recognition Constants
export const DEFAULT_LANGUAGE = 'id-ID'
export const SPEECH_RECOGNITION_TIMEOUT = 10000 // 10 seconds
export const SELECTION_RESET_TIMEOUT = 1000 // 1 second
export const FUZZY_MATCH_THRESHOLD = 0.2
export const MOBILE_BREAKPOINT = 600 // pixels

// Error Messages
export const ERROR_MESSAGES = {
  permission: 'Tidak dapat mengakses mikrofon. Periksa perizinan browser.',
  network: 'Masalah koneksi jaringan. Coba lagi nanti.',
  timeout: 'Waktu tunggu habis. Silakan coba lagi.',
  'not-supported': 'Browser tidak mendukung speech recognition.',
  unknown: 'Terjadi kesalahan tidak dikenal. Silakan coba lagi.',
  'browser-not-supported': 'Harus Menggunakan Browser Google Chrome',
  'root-not-found': 'Root element not found in the document'
} as const

// UI Messages
export const UI_MESSAGES = {
  starting: 'Memulai speech recognition...',
  active: 'Speech recognition aktif. Ucapkan nama buah!',
  stopped: 'Speech recognition dihentikan.',
  microphone_on: 'on',
  microphone_off: 'off'
} as const

// Button Labels
export const BUTTON_LABELS = {
  reset_transcript: 'Reset Transcript',
  hold_to_talk: 'Hold to talk',
  reload: 'Reload Application'
} as const

// Error Types
export enum ErrorType {
  PERMISSION = 'permission',
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  NOT_SUPPORTED = 'not-supported',
  UNKNOWN = 'unknown'
}
