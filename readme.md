# Speech Recognition Fruit Game

An interactive web application that helps users practice speaking Indonesian fruit names using voice recognition technology. When you correctly say the name of a fruit, that fruit's image will be highlighted with a red border.

## Features
- Voice recognition for Indonesian fruit names
- Interactive visual feedback when correct fruit is spoken
- Responsive design that works on both mobile and desktop
- Sound feedback for correct/incorrect responses
- Smooth animations and visual transitions
- Accessibility support with ARIA attributes
- Error handling for speech recognition and image loading

## How to Use
1. Open the app in a modern browser (Google Chrome recommended)
2. Allow microphone access when prompted
3. Hold the "Hold to talk" button and speak the name of a fruit
4. When you correctly say a fruit name, its image will be highlighted with a red border

## Supported Fruit Names
- apel (apple)
- blueberry (blueberry)
- pisang (banana)
- stroberi (strawberry)
- terong (eggplant)

## Technical Stack
- React 18 with TypeScript
- Vite for build tooling
- react-speech-recognition for voice processing
- Web Audio API for sound feedback
- Responsive design with CSS

## Running Locally
1. Clone this repository
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm run dev`
4. Open `http://localhost:5173` in your browser

## Browser Support
- Works best on Google Chrome
- Requires a browser that supports the Web Speech API
- Microphone access must be granted for voice recognition to work

## Mobile Usage
The app is optimized for mobile devices and works well on smartphones and tablets.
