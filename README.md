# Bell Audio PWA

A Progressive Web App conversion of the Bell Audio Engine Sequencer, optimized for mobile devices with background audio capabilities.

## Overview

Transform a sophisticated HTML audio sequencer into a mobile-optimized PWA that provides:
- **Background Audio Playback**: Continue audio sessions when screen is off
- **Mobile-Optimized Interface**: Touch-friendly controls and responsive design
- **Offline Functionality**: Core features work without internet connection
- **Cross-Platform Compatibility**: Works on iOS, Android, and desktop browsers
- **Native App Experience**: Installable PWA with app-like behavior

## Features

### Audio Engine (Preserved)
- Advanced bell synthesis with harmonic generation
- Binaural beat generation for meditation and therapy
- Real-time spectrum analysis and visualization
- Custom convolution reverb with impulse responses
- Dynamic compression and stereo enhancement
- Precision sequencing with multiple sustain modes

### PWA Enhancements
- **Installable**: Add to home screen on mobile devices
- **Offline Mode**: Core functionality without network connection
- **Background Audio**: Media session controls and screen-off playback
- **Wake Lock**: Prevent sleep during active sessions
- **Service Worker**: Efficient caching and background sync

### Mobile Optimizations
- **Touch Interface**: 44px minimum touch targets with haptic feedback
- **Responsive Design**: Optimized layouts for all screen sizes
- **Gesture Support**: Swipe, pinch, and long-press interactions
- **Performance**: 60fps UI with optimized audio processing
- **Battery Efficient**: Smart power management for extended use

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Audio**: Web Audio API with mobile optimizations
- **PWA**: Service Worker, Web App Manifest, Media Session API
- **Mobile**: Touch gestures, Wake Lock API, responsive design
- **Performance**: Object pooling, memory optimization, monitoring
- **Testing**: Lighthouse, Jest, Playwright, real device testing

## Browser Support

- **iOS Safari 14+**: Full PWA support with audio optimizations
- **Chrome Mobile 90+**: Complete PWA and background audio
- **Firefox Mobile 88+**: Core features with graceful degradation
- **Samsung Internet 14+**: Full PWA compatibility
- **Desktop Browsers**: Enhanced features and performance

## Performance Targets

- **Load Time**: <3 seconds on 3G networks
- **Audio Latency**: <20ms on modern mobile devices
- **Memory Usage**: <50MB for typical sessions
- **Battery Drain**: <5% per hour during background playback
- **Lighthouse Scores**: PWA ≥90, Performance ≥90, Accessibility ≥95

## Development

### Project Structure
```
BellAudioPWA/
├── .claude/
│   └── agents/          # Specialized development agents
├── Core/               # Project configuration and rules
├── Tasks/              # Development epic and story structure
├── QualityGates/       # Validation and testing requirements
├── Security/           # Security and compliance requirements
├── PRD.md              # Product Requirements Document
├── Architecture.md     # System architecture documentation
└── DevLog.md          # Development progress and decisions
```

### Specialized Agents
- **PWAConverter**: PWA manifest and service worker implementation
- **WebAudioOptimizer**: Mobile audio engine optimization
- **MobileUIAdapter**: Touch interface adaptation
- **BackgroundAudioManager**: Background audio session management
- **PerformanceOptimizer**: Mobile performance optimization
- **QualityAssurance**: PWA quality validation and testing

### Development Phases
1. **PWA Foundation**: Manifest, service worker, installability
2. **Mobile Optimization**: Touch interface, responsive design
3. **Background Audio**: Media session, wake lock, state management
4. **Quality & Performance**: Testing, optimization, validation

## Quality Standards

- Zero audio functionality regressions
- PWA compliance with web standards
- Cross-platform consistency
- Accessibility compliance (WCAG 2.1 AA)
- Performance monitoring and optimization
- Comprehensive testing on real devices

## Security

- HTTPS enforced for all PWA and audio features
- Content Security Policy implementation
- Audio permission handling with user gestures
- Privacy-compliant background operation
- Secure service worker and cache management

## Installation

As a PWA, this application can be installed directly from the browser:
1. Visit the application URL in a compatible browser
2. Look for the "Install" or "Add to Home Screen" prompt
3. Follow browser-specific installation instructions
4. Launch from home screen for native app experience

## Usage

### Basic Operation
1. Open the installed PWA or visit the web URL
2. Grant audio permissions when prompted
3. Configure bell frequencies and sequencing parameters
4. Start audio session for meditation or therapy
5. Application continues playing in background when screen turns off

### Background Audio
- Media controls appear on lock screen
- Playback continues when app is backgrounded
- Automatic wake lock prevents sleep during sessions
- Battery-optimized for extended use

## Contributing

This project uses an agent-based development approach with specialized AI agents handling different aspects of the conversion process. See individual agent documentation in `.claude/agents/` for specific contribution guidelines.

## License

This project preserves the licensing of the original Bell Audio Engine while adding PWA enhancements for mobile and offline use.