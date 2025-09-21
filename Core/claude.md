# Claude Configuration for BellAudioPWA

## Inherited from MetaAppMaker
This App Maker inherits advanced intelligence about:
- Context window management via MasterContext.md
- Quality gate enforcement and validation
- Agent orchestration and coordination
- Token efficiency and sharding strategies
- Best practices DNA and security embedding

## Project Context
- **Name**: BellAudioPWA
- **Type**: Progressive Web App conversion of HTML audio sequencer
- **Primary Technology**: Web Audio API, HTML5, JavaScript, PWA
- **Target Platform**: Mobile-first PWA with background audio capabilities

## Agent Coordination
This project uses specialized agents in `.claude/agents/` folder:
- **PWAConverter**: Handles PWA manifest and service worker implementation
- **WebAudioOptimizer**: Optimizes audio engine for mobile devices
- **MobileUIAdapter**: Adapts interface for touch interaction
- **BackgroundAudioManager**: Manages background audio sessions
- **PerformanceOptimizer**: Ensures optimal mobile performance
- **QualityAssurance**: Validates PWA functionality and quality

## PWA-Specific Rules

### 1. Web Audio API Optimization
- Always consider mobile Safari limitations and iOS audio policies
- Implement user gesture requirements for audio context initialization
- Use AudioWorklet for performance-critical audio processing
- Handle audio context suspension/resumption for background playback

### 2. Service Worker Implementation
- Cache audio files and assets for offline functionality
- Implement background sync for audio session management
- Handle audio interruptions and resumptions gracefully
- Maintain playback state across app lifecycle events

### 3. Mobile UI/UX Requirements
- Touch-optimized controls with minimum 44px touch targets
- Responsive design for various mobile screen sizes
- Consider device orientation changes during audio playback
- Implement haptic feedback for key interactions

### 4. Performance Constraints
- Minimize main thread blocking during audio processing
- Use Web Workers for non-audio computational tasks
- Implement efficient memory management for audio buffers
- Optimize for mobile CPU and battery constraints

### 5. Background Audio Management
- Implement Media Session API for background controls
- Handle audio focus management with other apps
- Maintain playback during screen lock and app backgrounding
- Implement proper cleanup on app termination

## Security Considerations
- Validate all audio file inputs to prevent XSS
- Implement Content Security Policy for PWA
- Secure service worker registration and updates
- Handle cross-origin audio resources properly

## Testing Requirements
- Test on real mobile devices, especially iOS Safari
- Validate PWA installation and offline functionality
- Test background audio across different mobile scenarios
- Performance testing under mobile network conditions